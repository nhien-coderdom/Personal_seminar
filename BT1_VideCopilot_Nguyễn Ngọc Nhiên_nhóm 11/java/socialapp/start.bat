@echo off
echo ================================
echo  Spring Boot Social Media API
echo ================================
echo.

cd /d "%~dp0"

echo Starting application...
echo Please wait for startup (30-60 seconds)...
echo.

call gradlew.bat bootRun

echo.
echo Application URLs:
echo - API Base: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui/index.html
echo - Health Check: http://localhost:8080/api/actuator/health
echo.
pause
