import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, UserCheck, Activity, RefreshCw } from "lucide-react";
import { DashboardStats } from "@/types";
import { format } from "date-fns";
import api from "@/services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchDashboardStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/admin/dashboard-stats");
      if (response.data) {
        const data = {
          totalUsers: response.data.totalUsers || 0,
          totalFiles: response.data.totalFiles || 0,
          totalCustomers: response.data.totalCustomers || 0,
          recentActivity: response.data.recentActivity || [],
        };
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Fallback to empty data
      setStats({
        totalUsers: 0,
        totalFiles: 0,
        totalCustomers: 0,
        recentActivity: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-16 bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats!.totalUsers, icon: Users, color: "text-primary" },
    { label: "Total Files", value: stats!.totalFiles, icon: FolderOpen, color: "text-accent" },
    { label: "Customers", value: stats!.totalCustomers, icon: UserCheck, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your CRM system</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats!.recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">by {item.userName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{item.action.replace("_", " ")}</Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(item.timestamp), "MMM d, HH:mm")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
