import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Plus,
  Sprout,
  Users,
  Settings,
  LogOut,
  Flower,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ModeToggleSidebarItem = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <SidebarMenuButton
      onClick={() => dispatch(toggleTheme())}
      tooltip="Toggle Theme"
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
    </SidebarMenuButton>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Plants",
      url: "/admin/plants",
      icon: Sprout,
    },
    {
      title: "Add Plant Data",
      icon: Plus,
      items: [
        { title: "Main Plant Entry", url: "/admin/add-plant" },
        { title: "Families", url: "/admin/families" },
        { title: "Origins", url: "/admin/origins" },
        { title: "Habitats", url: "/admin/habitats" },
        // { title: "Chemical Constituents", url: "/admin/constituents" },
        { title: "Chemical Profiles", url: "/admin/chemical-profiles" },
        { title: "Medicinal Profiles", url: "/admin/medicinal-profiles" },
        { title: "Cultivation Data", url: "/admin/cultivation-data" },
        { title: "Plant Parts", url: "/admin/parts" },
        { title: "Tags", url: "/admin/tags" },
        // Add more as we build them
      ],
    },
    {
      title: "Entry Guide",
      url: "/admin/guide",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/home"
          className="flex items-center gap-2 px-2 py-4 hover:opacity-80 transition-opacity"
        >
          <Flower className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold group-data-[collapsible=icon]:hidden">
            Harbloom Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items?.length ? (
                    <Collapsible
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <div>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span>{item.title}</span>
                            <Plus className="ml-auto w-4 h-4 group-data-[state=open]/collapsible:hidden" />
                            <Plus className="ml-auto w-4 h-4 group-data-[state=closed]/collapsible:hidden rotate-45" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location.pathname === subItem.url}
                                >
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Theme Toggle Item */}
          <SidebarMenuItem>
            <ModeToggleSidebarItem />
          </SidebarMenuItem>

          {/* Logout Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => dispatch(logoutUser())}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
