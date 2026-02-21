# File Management System - Backend API

A production-ready Spring Boot backend for secure file management with user authentication and role-based access control.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Access Control**: ADMIN and CUSTOMER roles with different permissions
- **File Management**: Upload, download, and delete files with ownership validation
- **Admin Dashboard**: View all users and files with system statistics
- **Secure API**: CORS configured, input validation, and exception handling

## Technology Stack

- Java 17
- Spring Boot 3.2.1
- Spring Security with JWT
- Spring Data JPA & Hibernate
- MySQL 8.0
- Maven

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+

## Installation & Setup

### 1. Database Setup

Create the database and tables:

```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

Default credentials to update in `application.properties`:
- Username: `root`
- Password: `root`
- Database: `file_management`

### 2. Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/file_management
spring.datasource.username=root
spring.datasource.password=root
app.jwtSecret=your-long-secret-key-here
```

**Important**: Change `app.jwtSecret` to a long random string in production.

### 3. Build & Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### File Endpoints

#### Upload File
```
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file data>

Response: 201 Created
{
  "id": "1",
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 1024000,
  "uploadedAt": "2024-01-15T10:30:00",
  "userId": "1",
  "userName": "John Doe",
  "url": "/api/files/download/1"
}
```

#### Get User's Files
```
GET /api/files/user
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "1",
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "uploadedAt": "2024-01-15T10:30:00",
    "userId": "1",
    "userName": "John Doe",
    "url": "/api/files/download/1"
  }
]
```

#### Delete File
```
DELETE /api/files/{fileId}
Authorization: Bearer <token>

Response: 200 OK
```

#### Download File
```
GET /api/files/download/{fileId}

Response: 200 OK (Binary file data)
```

### Admin Endpoints

All admin endpoints require `ADMIN` role.

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": "1",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

#### Get All Files
```
GET /api/admin/files
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": "1",
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "uploadedAt": "2024-01-15T10:30:00",
    "userId": "1",
    "userName": "John Doe",
    "url": "/api/files/download/1"
  }
]
```

#### Get Dashboard Statistics
```
GET /api/admin/dashboard-stats
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "totalUsers": 5,
  "totalFiles": 12,
  "totalCustomers": 4,
  "recentActivity": []
}
```

## Default Test Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Customer Account
- Email: `customer@example.com`
- Password: `customer123`

## Error Handling

All API responses follow standard HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input or request format
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., email)
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00"
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt password encryption
- **Role-Based Authorization**: @PreAuthorize annotations
- **CORS Configuration**: Allows requests from specified origins
- **File Ownership Validation**: Users can only delete their own files
- **SQL Injection Prevention**: Parameterized JPA queries

## File Upload Configuration

Default maximum file size: 100MB

To change, update in `application.properties`:
```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

## Logging

Logs are output to console. Configure log levels in `application.properties`:
```properties
logging.level.com.example.filemanagement=DEBUG
logging.level.org.springframework.security=INFO
```

## Project Structure

```
backend/
├── src/main/java/com/example/filemanagement/
│   ├── config/              # Spring configuration
│   ├── controller/          # REST endpoints
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA entities
│   ├── exception/           # Custom exceptions
│   ├── repository/          # Data access layer
│   ├── security/            # JWT and security components
│   ├── service/             # Business logic
│   └── FileManagementApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql
├── pom.xml
└── README.md
```

## Troubleshooting

### Database Connection Issues
```
Error: Communications link failure
```
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify network connectivity

### Authentication Failed
```
Error: Invalid email or password
```
- Check user credentials
- Ensure user exists in database
- Verify JWT token in Authorization header

### File Upload Fails
```
Error: Failed to upload file
```
- Check disk space
- Verify `uploads` directory exists and is writable
- Check file size limits

## Development

### Generate New Passwords for Test Accounts

Use BCrypt to generate hashed passwords:

```java
new BCryptPasswordEncoder().encode("your_password");
```

Then update the SQL insert statements with the new hashes.

## Deployment

### Production Checklist

1. Change JWT secret to a strong random key
2. Update database credentials
3. Set Spring profiles to `prod`
4. Configure proper logging
5. Enable HTTPS
6. Implement rate limiting
7. Set up monitoring and alerts
8. Configure backup strategy

### Docker Deployment

Add `Dockerfile` and `docker-compose.yml` for containerization.

## Support

For issues or questions, please create an issue in the repository.

## License

This project is licensed under the MIT License.
