import { User, FileItem, DashboardStats, ActivityItem } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@filecrm.com",
    firstName: "Sarah",
    lastName: "Chen",
    role: "ADMIN",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T14:30:00Z",
  },
  {
    id: "2",
    email: "john@example.com",
    firstName: "John",
    lastName: "Rivera",
    role: "CUSTOMER",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-05-28T11:00:00Z",
  },
  {
    id: "3",
    email: "emma@example.com",
    firstName: "Emma",
    lastName: "Larsson",
    role: "CUSTOMER",
    createdAt: "2024-03-10T16:45:00Z",
    updatedAt: "2024-06-02T08:20:00Z",
  },
  {
    id: "4",
    email: "alex@example.com",
    firstName: "Alex",
    lastName: "Nakamura",
    role: "CUSTOMER",
    createdAt: "2024-04-05T12:30:00Z",
    updatedAt: "2024-06-03T17:45:00Z",
  },
  {
    id: "5",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Santos",
    role: "CUSTOMER",
    createdAt: "2024-04-18T08:00:00Z",
    updatedAt: "2024-06-01T09:10:00Z",
  },
];

export const mockFiles: FileItem[] = [
  { id: "f1", name: "contract_2024.pdf", type: "application/pdf", size: 245000, uploadedAt: "2024-05-20T10:00:00Z", userId: "2", userName: "John Rivera" },
  { id: "f2", name: "profile_photo.jpg", type: "image/jpeg", size: 1200000, uploadedAt: "2024-05-21T14:30:00Z", userId: "2", userName: "John Rivera" },
  { id: "f3", name: "invoice_march.pdf", type: "application/pdf", size: 189000, uploadedAt: "2024-05-22T09:15:00Z", userId: "3", userName: "Emma Larsson" },
  { id: "f4", name: "report_q1.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 456000, uploadedAt: "2024-05-23T16:00:00Z", userId: "3", userName: "Emma Larsson" },
  { id: "f5", name: "id_scan.png", type: "image/png", size: 3400000, uploadedAt: "2024-05-25T11:45:00Z", userId: "4", userName: "Alex Nakamura" },
  { id: "f6", name: "agreement.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 98000, uploadedAt: "2024-06-01T08:30:00Z", userId: "4", userName: "Alex Nakamura" },
  { id: "f7", name: "passport_copy.pdf", type: "application/pdf", size: 567000, uploadedAt: "2024-06-02T13:20:00Z", userId: "5", userName: "Maria Santos" },
  { id: "f8", name: "tax_return_2023.pdf", type: "application/pdf", size: 890000, uploadedAt: "2024-06-03T10:10:00Z", userId: "2", userName: "John Rivera" },
];

export const mockActivity: ActivityItem[] = [
  { id: "a1", action: "file_upload", description: "Uploaded tax_return_2023.pdf", timestamp: "2024-06-03T10:10:00Z", userId: "2", userName: "John Rivera" },
  { id: "a2", action: "file_upload", description: "Uploaded passport_copy.pdf", timestamp: "2024-06-02T13:20:00Z", userId: "5", userName: "Maria Santos" },
  { id: "a3", action: "profile_update", description: "Updated profile information", timestamp: "2024-06-02T08:20:00Z", userId: "3", userName: "Emma Larsson" },
  { id: "a4", action: "file_upload", description: "Uploaded agreement.docx", timestamp: "2024-06-01T08:30:00Z", userId: "4", userName: "Alex Nakamura" },
  { id: "a5", action: "user_register", description: "New customer registered", timestamp: "2024-04-18T08:00:00Z", userId: "5", userName: "Maria Santos" },
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  totalFiles: mockFiles.length,
  totalCustomers: mockUsers.filter((u) => u.role === "CUSTOMER").length,
  recentActivity: mockActivity,
};

// Mock credentials for demo login
export const MOCK_CREDENTIALS = {
  admin: { email: "admin@filecrm.com", password: "admin123" },
  customer: { email: "john@example.com", password: "customer123" },
};
