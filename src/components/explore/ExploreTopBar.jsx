import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Separator } from "@/components/ui/separator";
import { logoutUser } from "@/store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ExploreTopBar = ({
  toggleSidebar,
  isSidebarOpen,
  showSidebarToggle = true,
}) => {
  const theme = useSelector((state) => state.theme.mode);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/search" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-2 md:gap-4 min-w-fit">
        {/* Toggle Button: Only if TopBar Toggle is enabled AND Sidebar is closed */}
        {!isSidebarOpen && showSidebarToggle && (
          <motion.div layoutId="menu-toggle-button">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </motion.div>
        )}

        {/* Logo: Always navigates to Home */}
        {(!isSidebarOpen || !showSidebarToggle) && (
          <motion.div
            className="flex items-center gap-2 select-none cursor-pointer"
            layoutId="brand-logo"
            onClick={() => navigate("/home")}
          >
            <span className="material-symbols-outlined text-primary text-3xl">
              spa
            </span>
            <span className="text-2xl font-serif font-bold tracking-tight text-foreground hidden md:block">
              Harbloom
            </span>
          </motion.div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="relative flex-1 max-w-xl mx-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground">
          search
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for medicinal plants, remedies..."
          className="h-11 w-full rounded-xl border border-input bg-muted/50 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
          onChange={(e) => {
            navigate(`/search?q=${encodeURIComponent(e.target.value)}`, {
              replace: true,
            });
          }}
          onClick={() => {
            if (window.location.pathname !== "/search") {
              navigate("/search");
            }
          }}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-fit justify-end">
        {user ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border border-border cursor-pointer transition-transform hover:scale-105">
                  <AvatarImage
                    src={
                      user.prefs?.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user.name || "User"
                      }`
                    }
                    className="object-cover"
                  />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account ({user.name})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <span className="material-symbols-outlined mr-2 !text-[16px]">
                    person
                  </span>
                  Profile
                </DropdownMenuItem>

                {/* Admin Dashboard Link */}
                {(() => {
                  const labels = user?.labels || [];
                  const prefsRole = user?.prefs?.role;
                  const prefsRoles = user?.prefs?.roles || [];
                  const allRoles = [
                    ...labels,
                    ...(prefsRole ? [prefsRole] : []),
                    ...(Array.isArray(prefsRoles) ? prefsRoles : []),
                  ].map((r) => String(r).toLowerCase());

                  if (allRoles.includes("admin")) {
                    return (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        <span className="material-symbols-outlined mr-2 !text-[16px]">
                          dashboard
                        </span>
                        Admin Dashboard
                      </DropdownMenuItem>
                    );
                  }
                  return null;
                })()}

                <DropdownMenuItem className="cursor-pointer">
                  <span className="material-symbols-outlined mr-2 !text-[16px]">
                    settings
                  </span>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => dispatch(toggleTheme())}
                  className="cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <span className="material-symbols-outlined mr-2 !text-[16px]">
                        dark_mode
                      </span>
                      Switch to Dark Mode
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2 !text-[16px]">
                        light_mode
                      </span>
                      Switch to Light Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-2 !text-[16px]">
                    logout
                  </span>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => dispatch(toggleTheme())}
                className="cursor-pointer"
              >
                {theme === "light" ? (
                  <>
                    <span className="material-symbols-outlined mr-2 !text-[16px]">
                      dark_mode
                    </span>
                    Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 !text-[16px]">
                      light_mode
                    </span>
                    Switch to Light Mode
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/login")}
                className="cursor-pointer text-primary"
              >
                <span className="material-symbols-outlined mr-2 !text-[16px]">
                  login
                </span>
                Log In
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default ExploreTopBar;
