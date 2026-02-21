# Backend Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Prerequisites

1. **Java 17**: Download from [java.com](https://www.oracle.com/java/technologies/downloads/#java17)
   - Verify: `java -version`

2. **MySQL 8.0**: Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - On macOS: `brew install mysql` then `brew services start mysql`
   - Verify: `mysql --version`

3. **Maven**: Download from [maven.apache.org](https://maven.apache.org/download.cgi)
   - Verify: `mvn -version`

### Step 2: Setup Database

Run the database initialization script:

```bash
# Navigate to backend directory
cd backend

# Create database and tables
mysql -u root -p < src/main/resources/schema.sql
```

When prompted, enter your MySQL root password (default is usually empty on fresh installs).

### Step 3: Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Update these if your MySQL credentials are different
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Step 4: Run Backend

```bash
cd backend
mvn spring-boot:run
```

The backend should start successfully:
```
Started FileManagementApplication in X.XXX seconds
Tomcat started on port(s): 3001
```

### Step 5: Connect Frontend

In the frontend project (`frontend/src/services/api.ts`):

```typescript
// Change this
const USE_MOCK = true;

// To this
const USE_MOCK = false;

// Update API_BASE_URL if needed
const API_BASE_URL = 'http://localhost:3001/api';
```

Then start the frontend:
```bash
cd frontend
npm run dev
```

## Test the API

### Using cURL

#### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Copy the returned `token` value.

#### Upload File
```bash
curl -X POST http://localhost:3001/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@path/to/your/file.txt"
```

### Using Postman

1. Import the API collection (coming soon)
2. Set environment variable `token` after login
3. Use {{token}} in request headers

## Default Test Accounts

After backend startup:

**Admin Account:**
- Email: `admin@filecrm.com`
- Password: `admin123`

**Customer Account:**
- Email: `john@example.com`  
- Password: `customer123`

> **Note**: These are seeded by backend startup if missing.

## Troubleshooting

### "Connection refused" error

**Problem**: Backend can't connect to MySQL
```
Communications link failure
```

**Solution**:
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `application.properties`
3. Check firewall settings

### "Port 3001 already in use"

**Problem**: Another service using port 3001

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 PID_NUMBER
```

Or change port in `application.properties`:
```properties
server.port=3002
```

### "File not found" error on upload

**Problem**: Upload directory doesn't exist

**Solution**:
```bash
mkdir uploads
chmod 755 uploads
```

### Authentication not working

**Problem**: Invalid token or credentials

**Solutions**:
1. Verify email/password are correct
2. Check token is included in Authorization header
3. Format: `Authorization: Bearer TOKEN_HERE`
4. Token might be expired (24 hours)

### Emails already registered

**Problem**: Registration fails with "Email already registered"

**Solution**:
```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE file_management;

# Delete the user
DELETE FROM users WHERE email = 'test@example.com';
```

## Project Structure

```
secure-own-files/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/...      # Java source code
│   ├── src/main/resources/    # Configuration & SQL
│   ├── pom.xml                # Maven dependencies
│   └── README.md              # Full documentation
├── frontend/                   # React frontend
│   ├── services/              # API services
│   ├── pages/                 # Page components
│   └── types/                 # TypeScript types
└── BACKEND_SETUP.md           # This file
```

## Next Steps

1. **Frontend Integration**: Update `frontend/src/services/authService.ts` to use real API
2. **File Download**: Implement file download functionality in frontend
3. **Admin Dashboard**: Connect admin pages to API
4. **Error Handling**: Implement proper error messages in frontend
5. **Deployment**: Deploy to Vercel (frontend) and Heroku/Railway (backend)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MySQL not found | Reinstall MySQL or add to PATH |
| Java not found | Reinstall Java and add to PATH |
| Port 3001 in use | Change port in application.properties |
| Can't create database | Check MySQL root password |
| Frontend can't reach API | Check CORS in SecurityConfig and firewall |

## Development Tips

### View Logs
```bash
# Enable DEBUG logging
# Edit application.properties
logging.level.com.example.filemanagement=DEBUG

# Then run
mvn spring-boot:run
```

### Hot Reload
```bash
# Dependencies auto-reload with devtools
# Just edit and save Java files - Spring Boot reloads automatically
```

### Database Inspection
```bash
# Connect to MySQL
mysql -u root -p

# View users
SELECT * FROM file_management.users;

# View files
SELECT * FROM file_management.files;
```

## Security Notes

⚠️ **Important**: These defaults are for development only!

Before production:
1. Change JWT secret in `application.properties` to a long random string
2. Update database credentials
3. Enable HTTPS
4. Configure proper firewall rules
5. Implement rate limiting
6. Set up monitoring

## Getting Help

1. Check backend logs for errors
2. Verify database connection
3. Ensure all prerequisites are installed
4. Check CORS configuration if frontend can't reach API
5. See `backend/README.md` for full API documentation

---

**Estimated Time**: 10 minutes for complete setup
**Support**: See `backend/README.md` for full documentation
