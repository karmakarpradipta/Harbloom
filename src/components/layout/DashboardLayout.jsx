import React from "react";
import ExploreSidebar from "@/components/explore/ExploreSidebar";
import ExploreTopBar from "@/components/explore/ExploreTopBar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const DashboardLayout = ({ children, breadcrumbs, showSidebar = true }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      
      {/* Sidebar - Conditionally rendered based on prop, but SidebarProvider handles logic */}
      {showSidebar && <ExploreSidebar />}

      {/* Main Content Area */}
      <SidebarInset>
        <ExploreTopBar showSidebarToggle={showSidebar} />

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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
