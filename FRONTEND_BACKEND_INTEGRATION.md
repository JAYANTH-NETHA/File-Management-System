# Frontend & Backend Integration Guide

This guide shows how to connect your React frontend to the Spring Boot backend.

## Overview

The backend provides REST APIs that match your frontend's service layer expectations.

**Backend URL**: `http://localhost:3001/api`

## Setup Steps

### 1. Update API Service

Edit `frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Update Auth Service

Edit `frontend/src/services/authService.ts`:

```typescript
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";
import api from "./api";

const USE_MOCK = false; // Set to false when backend is ready

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
```

### 3. Update File Service

Edit `src/services/fileService.ts`:

```typescript
import { FileItem } from "@/types";
import api from "./api";

const USE_MOCK = false;

export const fileService = {
  async getAll(): Promise<FileItem[]> {
    const res = await api.get<FileItem[]>("/files");
    return res.data;
  },

  async getByUser(userId: string): Promise<FileItem[]> {
    const res = await api.get<FileItem[]>("/files/user");
    return res.data;
  },

  async upload(userId: string, file: File): Promise<FileItem> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<FileItem>("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async remove(fileId: string): Promise<void> {
    await api.delete(`/files/${fileId}`);
  },

  async download(fileId: string): Promise<Blob> {
    const res = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return res.data;
  },
};
```

### 4. Update Auth Context

Edit `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "@/types";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore session on mount
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ email, password, firstName, lastName });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

## API Endpoints Summary

### Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/register` | RegisterRequest | AuthResponse |
| POST | `/auth/login` | LoginRequest | AuthResponse |
| GET | `/auth/profile` | - | UserDto |

### Files

| Method | Endpoint | Headers | Body | Response |
|--------|----------|---------|------|----------|
| POST | `/files/upload` | Bearer token | FormData | FileDto |
| GET | `/files/user` | Bearer token | - | FileDto[] |
| GET | `/files/{id}` | Bearer token | - | FileDto |
| DELETE | `/files/{id}` | Bearer token | - | 200 OK |
| GET | `/files/download/{id}` | - | - | Binary |

### Admin (Requires ADMIN role)

| Method | Endpoint | Headers | Response |
|--------|----------|---------|----------|
| GET | `/admin/users` | Bearer token | UserDto[] |
| GET | `/admin/files` | Bearer token | FileDto[] |
| GET | `/admin/dashboard-stats` | Bearer token | StatsDto |

## Error Handling

All errors follow this format:

```typescript
{
  message: string;
  status: number;
  timestamp: string;
}
```

Example error handling:

```typescript
try {
  await authService.login(email, password);
} catch (error) {
  if (error.response?.status === 401) {
    // Invalid credentials
  } else if (error.response?.status === 409) {
    // Email already registered
  } else {
    // Other error
  }
}
```

## Testing Workflow

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Register New Account
- Go to register page
- Enter credentials
- Click register
- Check backend logs for success

### 4. Upload File
- Login with new account
- Go to customer dashboard
- Upload a test file
- Verify file appears in list

### 5. Test Admin Panel
- Login with `admin@example.com` / `admin123`
- Go to admin dashboard
- Check users and files lists

## Common Issues

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Backend's CORS is configured for localhost:5173 and localhost:3000

### 401 Unauthorized
```
error: "invalid_token"
```

**Solutions**:
1. Ensure token is in localStorage
2. Check token isn't expired (24 hours)
3. Verify Authorization header format: `Bearer TOKEN`

### 404 Not Found
```
error: "File not found"
```

**Solutions**:
1. File might be deleted
2. Check file ID is correct
3. Verify you own the file

### File Upload Fails
```
error: "Failed to upload file"
```

**Solutions**:
1. Check file size (max 100MB)
2. Verify backend upload directory exists
3. Check disk space

## Debugging Tips

### Enable Network Logging
```typescript
// In api.ts
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[API] Error:', error);
    return Promise.reject(error);
  }
);
```

### Check Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action
4. Click request to see details
5. Check request/response headers

### Backend Logs
```bash
# Terminal output shows all API calls
# Check for errors with timestamps
```

## Environment Variables

For production, use environment variables:

```bash
# .env
VITE_API_URL=https://api.example.com
```

Update vite.config.ts:
```typescript
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
});
```

## Performance Optimizations

### 1. Implement Caching
```typescript
// In file service
const fileCache = new Map();

async getFile(id: string) {
  if (fileCache.has(id)) return fileCache.get(id);
  const file = await api.get(`/files/${id}`);
  fileCache.set(id, file.data);
  return file.data;
}
```

### 2. Batch Upload
```typescript
async uploadMultiple(files: File[]) {
  return Promise.all(
    files.map(file => this.upload(file))
  );
}
```

### 3. Lazy Loading
```typescript
// Only load admin data when admin page loads
const AdminDashboard = lazy(() => import('./AdminDashboard'));
```

## Security Notes

1. **Never expose tokens in URLs**
2. **Use HTTPS in production**
3. **Implement token refresh** (optional enhancement)
4. **Validate on backend** (always)
5. **Sanitize user input** (always)

## Next Steps

1. Test all endpoints
2. Implement file preview
3. Add progress indicators for upload
4. Implement pagination for file lists
5. Add search/filter functionality
6. Set up error boundaries
7. Implement retry logic

## Support

See `backend/README.md` for full API documentation and `BACKEND_SETUP.md` for backend setup.
