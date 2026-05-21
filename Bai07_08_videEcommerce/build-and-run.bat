@echo off
SET JAVA_HOME=C:\PROGRA~1\Java\jdk-24
SET MAVEN_HOME=d:\videEcommerce\maven\apache-maven-3.9.15
SET PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%

echo ========================================
echo  CHECKING TOOLS
echo ========================================
mvn --version
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven not found!
    pause
    exit /b 1
)
java --version
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  BUILDING ProjectWeb-main\BE
echo ========================================
cd /d "d:\videEcommerce\ProjectWeb-main\BE"
mvn clean package -DskipTests --no-transfer-progress
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build ProjectWeb-main\BE FAILED
    pause
    exit /b 1
)
echo [SUCCESS] Build ProjectWeb-main\BE DONE

echo.
echo ========================================
echo  BUILDING microservices_api_demo
echo ========================================
cd /d "d:\videEcommerce\microservices_api_demo"
mvn clean package -DskipTests --no-transfer-progress
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build microservices_api_demo FAILED
    pause
    exit /b 1
)
echo [SUCCESS] Build microservices_api_demo DONE

echo.
echo ========================================
echo  ALL BUILDS COMPLETE
echo ========================================
echo.
echo Next step: Run docker-compose
echo   cd d:\videEcommerce\ProjectWeb-main\BE
echo   docker compose up -d
echo.
pause
