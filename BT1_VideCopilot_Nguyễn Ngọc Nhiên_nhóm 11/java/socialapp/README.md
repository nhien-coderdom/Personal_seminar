# Spring Boot Social Media API

A comprehensive Spring Boot REST API application migrated from FastAPI, providing full CRUD operations for posts, comments, and likes.

## 🚀 Quick Start

### Prerequisites
- Java 21 or later
- Gradle (included via wrapper)

### Running the Application

```bash
# Clean and build
./gradlew clean compileJava

# Start the application
./gradlew bootRun
```

The application will start on `http://localhost:8080/api`

## 📚 API Documentation

- **Swagger UI**: [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/api/openapi.json](http://localhost:8080/api/openapi.json)
- **Health Check**: [http://localhost:8080/api/actuator/health](http://localhost:8080/api/actuator/health)

## 🎯 API Endpoints

### Posts
- `GET /posts` - List all posts
- `POST /posts` - Create a new post
- `GET /posts/{postId}` - Get a specific post
- `PATCH /posts/{postId}` - Update a post
- `DELETE /posts/{postId}` - Delete a post

### Comments
- `GET /posts/{postId}/comments` - List comments for a post
- `POST /posts/{postId}/comments` - Create a comment
- `GET /posts/{postId}/comments/{commentId}` - Get a specific comment
- `PATCH /posts/{postId}/comments/{commentId}` - Update a comment
- `DELETE /posts/{postId}/comments/{commentId}` - Delete a comment

### Likes
- `POST /posts/{postId}/likes` - Like a post
- `DELETE /posts/{postId}/likes` - Unlike a post

## 🗄️ Database

- **Type**: SQLite
- **File**: `sns_api.db` (auto-created)
- **Auto-initialization**: Tables created automatically on startup

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 21
- **Database**: SQLite
- **ORM**: JPA/Hibernate
- **Documentation**: SpringDoc OpenAPI
- **Build Tool**: Gradle

## 📁 Project Structure

```
src/main/java/com/contoso/socialapp/
├── SocialappApplication.java      # Main application
├── config/                        # Configuration classes
├── controller/                    # REST controllers
├── dto/                          # Data Transfer Objects
├── entity/                       # JPA entities
├── exception/                    # Error handling
├── repository/                   # Data access layer
└── service/                      # Business logic
```

## ✅ Compliance

This application is fully compliant with the original OpenAPI specification and provides identical functionality to the FastAPI implementation.
