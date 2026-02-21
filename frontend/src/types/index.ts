export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  userId: string;
  userName?: string;
  url?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalFiles: number;
  totalCustomers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}
