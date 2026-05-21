@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

SET JAVA_HOME=C:\PROGRA~1\Java\jdk-24
SET PATH=C:\PROGRA~1\Java\jdk-24\bin;d:\videEcommerce\maven\apache-maven-3.9.15\bin;%PATH%

echo ========================================
echo  Java home: %JAVA_HOME%
echo ========================================
java -version
IF %ERRORLEVEL% NEQ 0 ( echo [ERROR] Java failed & exit /b 1 )

echo.
echo ========================================
echo  Maven version
echo ========================================
mvn --version
IF %ERRORLEVEL% NEQ 0 ( echo [ERROR] Maven failed & exit /b 1 )

echo.
echo ========================================
echo  BUILD: ProjectWeb-main\BE
echo ========================================
cd /d "d:\videEcommerce\ProjectWeb-main\BE"
echo Working dir: %CD%
mvn clean package -DskipTests --no-transfer-progress
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAILED] ProjectWeb-main\BE build failed - xem loi o tren
    exit /b 1
)
echo [OK] ProjectWeb-main\BE build THANH CONG

echo.
echo ========================================
echo  BUILD: microservices_api_demo
echo ========================================
cd /d "d:\videEcommerce\microservices_api_demo"
echo Working dir: %CD%
mvn clean package -DskipTests --no-transfer-progress
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAILED] microservices_api_demo build failed - xem loi o tren
    exit /b 1
)
echo [OK] microservices_api_demo build THANH CONG

echo.
echo ==========================================
echo  TAT CA BUILDS THANH CONG!
echo ==========================================
ENDLOCAL
