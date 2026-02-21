import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  User,
  Upload,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/files", icon: FolderOpen, label: "All Files" },
];

const customerLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/files", icon: Upload, label: "My Files" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function AppSidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const links = hasRole("ADMIN") ? adminLinks : customerLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <FileText className="h-7 w-7 text-sidebar-primary" />
        <span className="text-xl font-bold tracking-tight text-sidebar-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          FileCRM
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="mb-3 px-1">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
