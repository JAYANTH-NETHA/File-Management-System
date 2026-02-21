# System Architecture

Complete technical architecture of the File Management System.

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                     │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │  Auth Pages   │  │ File Pages     │  │ Admin Pages  │   │
│  └───────┬───────┘  └────────┬───────┘  └──────┬───────┘   │
│          │                   │                 │             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Services & Context                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │ AuthService  │  │ FileService  │  │ UserService│  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │  │
│  │         │                 │                │         │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │      Axios HTTP Client (api.ts)                │ │  │
│  │  │  - JWT Token Injection                         │ │  │
│  │  │  - Request/Response Interceptors               │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                    REST API Calls
                    (JSON over HTTPS)
                         │
┌────────────────────────┴─────────────────────────────────────┐
│               Backend (Spring Boot 3.2)                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Controllers (REST Endpoints)                 │   │
│  │  ┌─────────────────┐  ┌──────────────────┐         │   │
│  │  │ AuthController  │  │ FileController   │         │   │
│  │  ├─ /auth/login    │  ├─ /files/upload   │         │   │
│  │  ├─ /auth/register │  ├─ /files/user     │         │   │
│  │  ├─ /auth/profile  │  ├─ /files/{id}     │         │   │
│  │  └─────────────────┘  └──────────────────┘         │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │      AdminController                         │  │   │
│  │  ├─ /admin/users                               │  │   │
│  │  ├─ /admin/files                               │  │   │
│  │  └─ /admin/dashboard-stats                     │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │         Security Layer                               │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  JwtAuthenticationFilter                     │   │   │
│  │  │  - Extract token from header                │   │   │
│  │  │  - Validate JWT signature                   │   │   │
│  │  │  - Set Security Context                     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  SecurityConfig                             │   │   │
│  │  │  - Authorization rules                      │   │   │
│  │  │  - CORS policy                              │   │   │
│  │  │  - Session management                       │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │         Service Layer (Business Logic)               │   │
│  │  ┌────────────────┐  ┌──────────────────────────┐  │   │
│  │  │ AuthService    │  │ FileService              │  │   │
│  │  ├─ login()       │  ├─ uploadFile()            │  │   │
│  │  ├─ register()    │  ├─ getFilesByUser()        │  │   │
│  │  ├─ getProfile()  │  ├─ deleteFile()            │  │   │
│  │  └────────────────┘  ├─ downloadFile()          │  │   │
│  │  ┌────────────────┐  └──────────────────────────┘  │   │
│  │  │ UserService    │  ┌──────────────────────────┐  │   │
│  │  ├─ getUserById() │  │ JwtUtil                  │  │   │
│  │  ├─ getAllUsers() │  ├─ generateToken()         │  │   │
│  │  │                │  ├─ validateToken()         │  │   │
│  │  └────────────────┘  ├─ extractUsername()       │  │   │
│  │                      └──────────────────────────┘  │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │         Repository Layer (Data Access)               │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ UserRepository                               │   │   │
│  │  │ - findByEmail()                             │   │   │
│  │  │ - existsByEmail()                           │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ FileRepository                               │   │   │
│  │  │ - findByUserId()                            │   │   │
│  │  │ - findById()                                │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │         Exception Handling                            │   │
│  │  - GlobalExceptionHandler                            │   │
│  │  - ResourceNotFoundException                         │   │
│  │  - EmailAlreadyExistsException                       │   │
│  │  - UnauthorizedAccessException                       │   │
│  └────────────────┬───────────────────────────────────────┘  │
└───────────────────┴─────────────────────────────────────────┘
                    │
            Database Queries (JDBC)
                    │
         ┌──────────┴──────────┐
         │                     │
     ┌───▼────┐          ┌────▼───┐
     │  Users │          │ Files  │
     │ Table  │          │ Table  │
     └────────┘          └────────┘
         │                    │
         └────────────────────┘
              MySQL Database
```

## Components Breakdown

### Frontend Architecture

#### Pages
```
pages/
├── Index.tsx              # Landing page
├── Login.tsx              # Login page
├── Register.tsx           # Registration page
├── NotFound.tsx           # 404 page
└── admin/
    ├── Dashboard.tsx      # Admin stats
    ├── Files.tsx          # All files
    └── Users.tsx          # All users
└── customer/
    ├── Dashboard.tsx      # Customer overview
    ├── Files.tsx          # User's files
    └── Profile.tsx        # User profile
```

#### Services
- **authService.ts**: Authentication endpoints
  - login(credentials) → AuthResponse
  - register(data) → AuthResponse
  - logout() → void

- **fileService.ts**: File operations
  - upload(file) → FileDto
  - getByUser(userId) → FileDto[]
  - remove(fileId) → void

- **userService.ts**: User operations
  - getProfile() → UserDto
  - updateProfile(data) → UserDto

#### Context
- **AuthContext.tsx**: Global auth state
  - Current user
  - JWT token
  - Login/register/logout

### Backend Architecture

#### Entity Layer (Models)
```
User (JPA Entity)
├── id (Long, PK)
├── email (String, Unique)
├── password (String, encrypted)
├── firstName (String)
├── lastName (String)
├── role (Enum: ADMIN, CUSTOMER)
├── avatar (String)
├── createdAt (LocalDateTime)
├── updatedAt (LocalDateTime)
└── files (List<FileEntity>, 1-to-many)

FileEntity (JPA Entity)
├── id (Long, PK)
├── name (String)
├── type (String, MIME type)
├── size (Long, bytes)
├── filePath (String)
├── uploadedAt (LocalDateTime)
└── user (User, foreign key)
```

#### DTO Layer (Data Transfer)
```
LoginRequest
├── email: String
└── password: String

RegisterRequest
├── email: String
├── password: String
├── firstName: String
└── lastName: String

AuthResponse
├── token: String (JWT)
└── user: UserDto

UserDto
├── id: String
├── email: String
├── firstName: String
├── lastName: String
├── role: UserRole
├── createdAt: String (ISO-8601)
├── updatedAt: String (ISO-8601)
└── avatar: String

FileDto
├── id: String
├── name: String
├── type: String (MIME)
├── size: Long
├── uploadedAt: String (ISO-8601)
├── userId: String
├── userName: String
└── url: String
```

#### Repository Layer
- **UserRepository**: CRUD for User
  - findByEmail(email)
  - existsByEmail(email)

- **FileRepository**: CRUD for FileEntity
  - findByUserId(userId)

#### Service Layer
- **AuthService**: Authentication logic
  - login(request): String (token)
  - register(request): void
  - getUserProfile(email): UserDto

- **UserService**: User management
  - getUserById(id): User
  - getUserByEmail(email): User
  - getAllUsers(): List<UserDto>
  - convertToDto(user): UserDto
  - Implements UserDetailsService

- **FileService**: File operations
  - uploadFile(file, user): FileDto
  - getFilesByUser(userId): List<FileDto>
  - deleteFile(fileId, user): void
  - downloadFile(fileId): byte[]

#### Controller Layer
- **AuthController** (/auth)
  - POST /login
  - POST /register
  - GET /profile

- **FileController** (/files)
  - POST /upload
  - GET /user
  - GET /{id}
  - DELETE /{id}
  - GET /download/{id}

- **AdminController** (/admin)
  - GET /users
  - GET /files
  - GET /dashboard-stats

#### Security Layer
- **JwtUtil**: Token operations
  - generateToken(userDetails, role): String
  - validateToken(token): boolean
  - extractUsername(token): String
  - extractRole(token): String

- **JwtAuthenticationFilter**: Request filtering
  - Extracts token from Authorization header
  - Validates JWT
  - Sets SecurityContext

- **SecurityConfig**: Spring Security configuration
  - Authorization rules
  - CORS policy
  - Session management

#### Exception Handling
- **GlobalExceptionHandler**: Centralized error handling
- **ResourceNotFoundException**: 404 errors
- **EmailAlreadyExistsException**: 409 conflicts
- **UnauthorizedAccessException**: 403 forbidden

## Data Flow Diagrams

### Authentication Flow

```
User Input (Email/Password)
         ↓
AuthPage Component
         ↓
authService.login(credentials)
         ↓
HTTP POST /auth/login
         ↓
AuthController.login()
         ↓
AuthenticationManager.authenticate()
         ↓
UserService.loadUserByUsername()
         ↓
UserRepository.findByEmail()
         ↓
Password Validation (BCrypt)
         ↓
JwtUtil.generateToken()
         ↓
AuthResponse (token + user)
         ↓
Frontend stores token & user
         ↓
AuthContext updated
         ↓
Redirect to dashboard
```

### File Upload Flow

```
User selects file
         ↓
FileComponent processes input
         ↓
fileService.upload(file)
         ↓
FormData with file + token in header
         ↓
HTTP POST /files/upload (multipart)
         ↓
JwtAuthenticationFilter validates token
         ↓
FileController.uploadFile()
         ↓
Extracts authenticated user
         ↓
FileService.uploadFile(file, user)
         ↓
Save to disk (/uploads)
         ↓
Create FileEntity in database
         ↓
Return FileDto
         ↓
Frontend adds to file list
         ↓
Show success message
```

### Authorization Flow

```
Request with Authorization header
         ↓
JwtAuthenticationFilter
         ↓
Extract token from "Bearer {token}"
         ↓
JwtUtil.validateToken()
         ↓
Valid?
  ├─ Yes: Extract username and role
  │       ↓
  │  Create UsernamePasswordAuthenticationToken
  │       ↓
  │  Set SecurityContext
  │       ↓
  │  Continue to endpoint
  │
  └─ No: Clear SecurityContext
         ↓
         SecurityConfig checks @PreAuthorize
         ├─ User has required role?
         │  ├─ Yes: Execute endpoint
         │  └─ No: Return 403 Forbidden
```

## API Request/Response Examples

### Register Request
```
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Register Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### File Upload Request
```
POST /api/files/upload HTTP/1.1
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

[Binary file data]
------WebKitFormBoundary--
```

### File Upload Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "42",
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "uploadedAt": "2024-01-15T10:30:00",
  "userId": "1",
  "userName": "John Doe",
  "url": "/api/files/download/42"
}
```

## Security Architecture

### Password Security
1. User submits password
2. BCryptPasswordEncoder hashes password
3. Hashed password stored in database
4. On login, submitted password hashed and compared

### Token Security
1. JWT created with:
   - User email (sub)
   - User role
   - Expiration (24 hours)
   - Secret key signature
2. Token sent to frontend
3. Frontend stores in localStorage
4. Frontend sends in every request
5. Backend validates signature and expiration

### Request Authorization
1. Token extracted from "Authorization: Bearer {token}" header
2. JwtUtil validates signature
3. Role verified against endpoint requirements
4. User context set for business logic

### File Ownership
1. FileEntity linked to User
2. When deleting file, verify user.id == file.user.id
3. Prevents user from deleting other's files

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role ENUM('ADMIN', 'CUSTOMER'),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX(email),
  INDEX(role)
);
```

### Files Table
```sql
CREATE TABLE files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  file_type VARCHAR(100),
  size BIGINT,
  file_path VARCHAR(500),
  user_id BIGINT NOT NULL,
  uploaded_at TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  INDEX(user_id),
  INDEX(uploaded_at)
);
```

## Deployment Architecture

### Development
```
Developer Machine
├── Frontend (Vite dev server) → localhost:5173
├── Backend (Spring Boot) → localhost:8080
└── MySQL → localhost:3306
```

### Production
```
Internet
    │
    ├─→ Frontend (Vercel CDN)
    │   - React static site
    │   - Deployed automatically from Git
    │
    └─→ Backend (Cloud Provider)
        - Spring Boot app
        - MySQL database
        - SSL/TLS certificates
```

## Performance Considerations

### Frontend
- Code splitting for lazy loading
- Image optimization
- Minification
- Service workers for offline support

### Backend
- Database indexing on frequently queried columns (email, userId)
- JWT caching to avoid DB hits
- File streaming for downloads
- Connection pooling for database

### Database
- Foreign key constraints for referential integrity
- Timestamps for audit trails
- Prepared statements to prevent SQL injection

## Scalability Notes

### Current Limitations
- Single backend instance
- Local file storage
- Single database

### Future Enhancements
- Load balancer for multiple backend instances
- Cloud storage (S3) for files
- Database read replicas
- Caching layer (Redis)
- Message queue (RabbitMQ)
- CDN for file distribution

---

For implementation details, see:
- `backend/README.md` - Backend API documentation
- `BACKEND_SETUP.md` - Setup instructions
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration guide
