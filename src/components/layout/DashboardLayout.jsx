import React, { useState, useEffect } from "react";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import ExploreTopBar from "@/components/explore/ExploreTopBar";
import Footer from "@/components/layout/Footer";

import Breadcrumbs from "@/components/common/Breadcrumbs";

const DashboardLayout = ({ children, breadcrumbs, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ensure hydration-safe initialization + responsive behavior
  useEffect(() => {
    if (!showSidebar) return; // Skip resize logic if sidebar is disabled
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  // Lock scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex transition-all duration-300 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <ExploreSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen && showSidebar ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <ExploreTopBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          showSidebarToggle={showSidebar}
        />

        {breadcrumbs && (
          <div className="sticky top-20 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3 md:px-8">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </div>
        )}

        <main className="flex-1 px-4 pt-4 sm:p-6 space-y-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="mt-auto z-10">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
