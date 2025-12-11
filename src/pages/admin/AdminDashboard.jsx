import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, Eye, ArrowUpRight } from "lucide-react";
import plantService from "@/services/plantService";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { refreshTrigger } = useOutletContext() || {};
  // Safety check: if accessed outside layout, context might be null.

  const [plantCount, setPlantCount] = useState(0);
  // Placeholders for other stats until we have backend support
  const [userCount, setUserCount] = useState(1234);
  const [viewCount, setViewCount] = useState("45.2k");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const plants = await plantService.getPlants(); // Assuming this returns all or a paginated list
        // If getPlants returns { data: [...], total: ... } adapt accordingly.
        // Based on previous checks, it returns documents array usually.
        // Let's assume array for now. If it returns an object, we'll fix.
        // Service usually returns response.documents for listAttributes.
        // Let's check service again or default to .length safe check.

        // Actually, listing ALL plants might be heavy just to get a count.
        // Does Service have getPlants? Yes.
        // We'll use result.total if available, or result.documents.length.

        if (plants && plants.documents) {
          setPlantCount(plants.total);
        } else if (Array.isArray(plants)) {
          setPlantCount(plants.length);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
  }, [refreshTrigger]); // Re-run when refresh button is clicked

  // Mock Data mixed with Real Data
  const stats = [
    {
      title: "Total Plants",
      value: plantCount,
      description: "Live database records",
      icon: Sprout,
    },
    {
      title: "Active Users",
      value: userCount, // Mock for now
      description: "+12% from last month",
      icon: Users,
    },
    {
      title: "Total Views",
      value: viewCount, // Mock for now
      description: "+8% from last month",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6 pt-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "Admin"}. Here's an overview of your
          platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Activity Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Plants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* We could also fetch recent plants here */}
              <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">
                Coming soon: Live feed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
