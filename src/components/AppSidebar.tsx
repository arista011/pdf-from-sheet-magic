import { useLocation, Link } from "react-router-dom";
import {
  FileSpreadsheet,
  Users,
  Upload,
  History,
  Database,
  Stethoscope,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import mitraLogo from "@/assets/mitra-keluarga-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    group: "Data MCU",
    items: [
      { title: "Upload Excel", url: "/", icon: Upload },
      { title: "Data Tersimpan", url: "/mcu-data", icon: Database },
      { title: "Riwayat PDF", url: "/pdf-history", icon: History },
    ],
  },
  {
    group: "Pasien",
    items: [
      { title: "Daftar Pasien", url: "/patients", icon: Users },
      { title: "Tambah Pasien", url: "/patients/add", icon: UserPlus },
    ],
  },
  {
    group: "Dokumen Medis",
    items: [
      { title: "Rontgen/EKG/Spiro", url: "/medical-documents", icon: Stethoscope },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <img
            src={mitraLogo}
            alt="Mitra Keluarga"
            className="h-8 w-8 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">MCU Generator</span>
              <span className="text-xs text-sidebar-foreground/70">
                Mitra Keluarga
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        {!collapsed && user && (
          <div className="px-2 py-2 text-xs text-sidebar-foreground/70 truncate">
            {user.email}
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Logout">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
