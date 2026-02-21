import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fileService } from "@/services/fileService";
import { FolderOpen, Upload, User } from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fileService.getByUser(user.id).then((files) => {
      setFileCount(files.length);
      setLoading(false);
    });
  }, [user]);

  const stats = [
    { label: "My Files", value: loading ? "…" : fileCount, icon: FolderOpen, color: "text-primary" },
    { label: "Profile Status", value: "Complete", icon: User, color: "text-accent" },
    { label: "Storage Used", value: loading ? "…" : `${fileCount} items`, icon: Upload, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your account</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
