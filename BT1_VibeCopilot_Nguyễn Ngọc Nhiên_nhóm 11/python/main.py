from fastapi import FastAPI, APIRouter, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
import uuid
from datetime import datetime
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sns_api.db"
OPENAPI_PATH = Path(__file__).resolve().parent.parent / "openapi.yaml"


def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT
        )
        """
    )
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            post_id TEXT NOT NULL,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT
        )
        """
    )
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS likes (
            post_id TEXT NOT NULL,
            username TEXT NOT NULL,
            created_at TEXT NOT NULL,
            PRIMARY KEY(post_id, username)
        )
        """
    )
    conn.commit()
    conn.close()


def row_to_post(row: sqlite3.Row) -> dict:
    return {
        "id": row[0],
        "username": row[1],
        "content": row[2],
        "createdAt": row[3],
        "updatedAt": row[4],
    }


class PostCreate(BaseModel):
    username: str
    content: str


class PostUpdate(BaseModel):
    username: str
    content: str


class CommentCreate(BaseModel):
    username: str
    content: str


class CommentUpdate(BaseModel):
    username: str
    content: str


class LikeCreate(BaseModel):
    username: str


app = FastAPI(
    title="Simple Social Media API",
    docs_url="/",
    redoc_url=None,
    openapi_url="/openapi.json",
)

# Allow CORS from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")


@app.on_event("startup")
def on_startup():
    init_db()
    # load openapi.yaml into memory and override app.openapi
    if OPENAPI_PATH.exists():
        with OPENAPI_PATH.open("r", encoding="utf-8") as f:
            spec = yaml.safe_load(f)

        def custom_openapi():
            return spec

        app.openapi = custom_openapi


# --- Posts ---
@router.get("/posts", response_model=List[dict])
def list_posts():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username, content, created_at, updated_at FROM posts ORDER BY created_at DESC")
    rows = c.fetchall()
    posts = []
    for r in rows:
        post = {
            "id": r[0],
            "username": r[1],
            "content": r[2],
            "createdAt": r[3],
            "updatedAt": r[4],
        }
        # counts
        c.execute("SELECT COUNT(*) FROM likes WHERE post_id = ?", (r[0],))
        post["likesCount"] = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM comments WHERE post_id = ?", (r[0],))
        post["commentsCount"] = c.fetchone()[0]
        posts.append(post)
    conn.close()
    return posts


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate):
    if not payload.username or not payload.content:
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username and content are required"})
    pid = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO posts (id, username, content, created_at) VALUES (?, ?, ?, ?)",
        (pid, payload.username, payload.content, now),
    )
    conn.commit()
    conn.close()
    return {
        "id": pid,
        "username": payload.username,
        "content": payload.content,
        "createdAt": now,
        "updatedAt": None,
        "likesCount": 0,
        "commentsCount": 0,
    }


@router.get("/posts/{postId}")
def get_post(postId: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username, content, created_at, updated_at FROM posts WHERE id = ?", (postId,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    post = {
        "id": row[0],
        "username": row[1],
        "content": row[2],
        "createdAt": row[3],
        "updatedAt": row[4],
    }
    c.execute("SELECT COUNT(*) FROM likes WHERE post_id = ?", (postId,))
    post["likesCount"] = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM comments WHERE post_id = ?", (postId,))
    post["commentsCount"] = c.fetchone()[0]
    conn.close()
    return post


@router.patch("/posts/{postId}")
def update_post(postId: str, payload: PostUpdate):
    if not payload.username or not payload.content:
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username and content are required"})
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT username FROM posts WHERE id = ?", (postId,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    if row[0] != payload.username:
        conn.close()
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username mismatch"})
    now = datetime.utcnow().isoformat() + "Z"
    c.execute("UPDATE posts SET content = ?, updated_at = ? WHERE id = ?", (payload.content, now, postId))
    conn.commit()
    conn.close()
    return get_post(postId)


@router.delete("/posts/{postId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(postId: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id = ?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    c.execute("DELETE FROM comments WHERE post_id = ?", (postId,))
    c.execute("DELETE FROM likes WHERE post_id = ?", (postId,))
    c.execute("DELETE FROM posts WHERE id = ?", (postId,))
    conn.commit()
    conn.close()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --- Comments ---
@router.get("/posts/{postId}/comments", response_model=List[dict])
def list_comments(postId: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, post_id, username, content, created_at, updated_at FROM comments WHERE post_id = ? ORDER BY created_at ASC", (postId,))
    rows = c.fetchall()
    if not rows:
        # still return empty list if post exists or not per PRD; check post existence
        c.execute("SELECT id FROM posts WHERE id = ?", (postId,))
        if not c.fetchone():
            conn.close()
            raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    comments = []
    for r in rows:
        comments.append({
            "id": r[0],
            "postId": r[1],
            "username": r[2],
            "content": r[3],
            "createdAt": r[4],
            "updatedAt": r[5],
        })
    conn.close()
    return comments


@router.post("/posts/{postId}/comments", status_code=status.HTTP_201_CREATED)
def create_comment(postId: str, payload: CommentCreate):
    if not payload.username or not payload.content:
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username and content are required"})
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id = ?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    cid = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    c.execute(
        "INSERT INTO comments (id, post_id, username, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (cid, postId, payload.username, payload.content, now),
    )
    conn.commit()
    conn.close()
    return {
        "id": cid,
        "postId": postId,
        "username": payload.username,
        "content": payload.content,
        "createdAt": now,
        "updatedAt": None,
    }


@router.get("/posts/{postId}/comments/{commentId}")
def get_comment(postId: str, commentId: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, post_id, username, content, created_at, updated_at FROM comments WHERE id = ? AND post_id = ?", (commentId, postId))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Comment not found"})
    comment = {
        "id": row[0],
        "postId": row[1],
        "username": row[2],
        "content": row[3],
        "createdAt": row[4],
        "updatedAt": row[5],
    }
    conn.close()
    return comment


@router.patch("/posts/{postId}/comments/{commentId}")
def update_comment(postId: str, commentId: str, payload: CommentUpdate):
    if not payload.username or not payload.content:
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username and content are required"})
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT username FROM comments WHERE id = ? AND post_id = ?", (commentId, postId))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Comment not found"})
    if row[0] != payload.username:
        conn.close()
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username mismatch"})
    now = datetime.utcnow().isoformat() + "Z"
    c.execute("UPDATE comments SET content = ?, updated_at = ? WHERE id = ?", (payload.content, now, commentId))
    conn.commit()
    conn.close()
    return get_comment(postId, commentId)


@router.delete("/posts/{postId}/comments/{commentId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(postId: str, commentId: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM comments WHERE id = ? AND post_id = ?", (commentId, postId))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Comment not found"})
    c.execute("DELETE FROM comments WHERE id = ?", (commentId,))
    conn.commit()
    conn.close()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --- Likes ---
@router.post("/posts/{postId}/likes", status_code=status.HTTP_201_CREATED)
def like_post(postId: str, payload: LikeCreate):
    if not payload.username:
        raise HTTPException(status_code=400, detail={"code": 400, "message": "username is required"})
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id = ?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    now = datetime.utcnow().isoformat() + "Z"
    try:
        c.execute("INSERT INTO likes (post_id, username, created_at) VALUES (?, ?, ?)", (postId, payload.username, now))
        conn.commit()
    except sqlite3.IntegrityError:
        # already liked, return existing like representation
        conn.close()
        return {"postId": postId, "username": payload.username, "createdAt": now}
    conn.close()
    return {"postId": postId, "username": payload.username, "createdAt": now}


@router.delete("/posts/{postId}/likes", status_code=status.HTTP_204_NO_CONTENT)
def unlike_post(postId: str, payload: LikeCreate):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM posts WHERE id = ?", (postId,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail={"code": 404, "message": "Post not found"})
    c.execute("DELETE FROM likes WHERE post_id = ? AND username = ?", (postId, payload.username))
    conn.commit()
    conn.close()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


app.include_router(router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
