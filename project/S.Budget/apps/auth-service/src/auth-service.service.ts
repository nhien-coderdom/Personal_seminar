import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import { RegisterDto, LoginDto } from '@app/shared/dto';
import { IJwtPayload, IUser } from '@app/shared/interfaces';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── REGISTER ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ user: IUser }> {
    // 1. Kiểm tra email trùng
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // 2. Mã hoá mật khẩu với bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // 3. Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    return {
      user: this._sanitizeUser(user),
    };
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────────

  async login(
    dto: LoginDto,
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    console.log(`[AUTH] Processing login for user: ${dto.email}`);
    // 1. Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      console.error(`[AUTH] Login failed: User not found (${dto.email})`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. So khớp mật khẩu
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Tạo JWT tokens
    const payload: IJwtPayload = { sub: user.id, email: user.email };
    const accessToken = this._generateAccessToken(payload);
    const refreshToken = this._generateRefreshToken(payload);

    return {
      user: this._sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // ─── VALIDATE TOKEN (dùng bởi API Gateway) ───────────────────────────────────

  async validateToken(token: string): Promise<IJwtPayload> {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: process.env['JWT_SECRET'],
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ─── REFRESH TOKEN ───────────────────────────────────────────────────────────

  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: process.env['JWT_REFRESH_SECRET'],
      });

      // Xác nhận user vẫn tồn tại
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: IJwtPayload = { sub: user.id, email: user.email };
      return {
        accessToken: this._generateAccessToken(newPayload),
        refreshToken: this._generateRefreshToken(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  private _generateAccessToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env['JWT_SECRET'],
      expiresIn: '15m',
    });
  }

  private _generateRefreshToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'],
      expiresIn: '7d',
    });
  }

  /** Loại bỏ trường password trước khi trả về client */
  private _sanitizeUser(user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): IUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
