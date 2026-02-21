import { FileItem } from "@/types";
import api from "./api";

const USE_MOCK = false;

export const fileService = {
  async getAll(): Promise<FileItem[]> {
    if (USE_MOCK) {
      const { mockFiles } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 400));
      return [...mockFiles];
    }
    const res = await api.get<FileItem[]>("/admin/files");
    return res.data;
  },

  async getByUser(userId: string): Promise<FileItem[]> {
    if (USE_MOCK) {
      const { mockFiles } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 300));
      return mockFiles.filter((f) => f.userId === userId);
    }
    const res = await api.get<FileItem[]>("/files/user");
    return res.data;
  },

  async upload(userId: string, file: File): Promise<FileItem> {
    if (USE_MOCK) {
      const { mockFiles } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 800));
      const newFile: FileItem = {
        id: `f${mockFiles.length + 1}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        userId,
      };
      mockFiles.push(newFile);
      return newFile;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<FileItem>("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async remove(fileId: string): Promise<void> {
    if (USE_MOCK) {
      const { mockFiles } = await import("@/data/mockData");
      await new Promise((r) => setTimeout(r, 400));
      const idx = mockFiles.findIndex((f) => f.id === fileId);
      if (idx === -1) throw new Error("File not found");
      mockFiles.splice(idx, 1);
      return;
    }
    await api.delete(`/files/${fileId}`);
  },
};
