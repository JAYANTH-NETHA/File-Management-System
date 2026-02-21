import { User } from "@/types";
import api from "./api";

const USE_MOCK = false;

export const userService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) {
      const { mockUsers } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 400));
      return [...mockUsers];
    }
    const res = await api.get<User[]>("/admin/users");
    return res.data;
  },

  async getById(id: string): Promise<User> {
    if (USE_MOCK) {
      const { mockUsers } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 300));
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      return { ...user };
    }
    const res = await api.get<User[]>("/admin/users");
    const user = res.data.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      const { mockUsers } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 400));
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("User not found");
      mockUsers[idx] = { ...mockUsers[idx], ...data, updatedAt: new Date().toISOString() };
      return { ...mockUsers[idx] };
    }
    const res = await api.put<User>(`/admin/users/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      const { mockUsers } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 400));
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("User not found");
      mockUsers.splice(idx, 1);
      return;
    }
    await api.delete(`/admin/users/${id}`);
  },
};
