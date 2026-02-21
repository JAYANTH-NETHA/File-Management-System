import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";
import api from "./api"; // Use real API

const USE_MOCK = false; // Use real backend

function generateMockToken(userId: string, role: string): string {
  // Simulates a JWT structure (not a real JWT)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: userId, role, exp: Date.now() + 86400000 }));
  return `${header}.${payload}.mock-signature`;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const { mockUsers, MOCK_CREDENTIALS } = await import("@/data/mockData");
      const isAdmin = data.email === MOCK_CREDENTIALS.admin.email && data.password === MOCK_CREDENTIALS.admin.password;
      const isCustomer = data.email === MOCK_CREDENTIALS.customer.email && data.password === MOCK_CREDENTIALS.customer.password;

      if (!isAdmin && !isCustomer) throw new Error("Invalid email or password");

      const user = mockUsers.find((u) => u.email === data.email)!;
      const token = generateMockToken(user.id, user.role);
      return { token, user };
    }

    // Real API call (Spring Boot)
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const { mockUsers } = await import("@/data/mockData");
      if (mockUsers.some((u) => u.email === data.email)) {
        throw new Error("Email already registered");
      }
      const newUser = {
        id: String(mockUsers.length + 1),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "CUSTOMER" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      const token = generateMockToken(newUser.id, newUser.role);
      return { token, user: newUser };
    }

    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
