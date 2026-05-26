# Stage 1: Build the Java app
FROM mcr.microsoft.com/devcontainers/java:21 AS builder
WORKDIR /app
COPY java/socialapp/ .
RUN ./gradlew build --no-daemon


# Stage 2: Create runtime image
FROM mcr.microsoft.com/devcontainers/java:21 AS runtime
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# Create SQLite database file
RUN apt-get update && apt-get install -y sqlite3 \
    && sqlite3 /app/sns_api.db "VACUUM;" \
    && apt-get remove -y sqlite3 && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
