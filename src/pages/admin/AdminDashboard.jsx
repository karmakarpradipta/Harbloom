import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Users, LayoutDashboard, ArrowUpRight, Leaf } from "lucide-react";
import plantService from "@/services/plantService";
import { Query } from "appwrite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { refreshTrigger } = useOutletContext() || {};

  const [stats, setStats] = useState({
    totalPlants: 0,
    totalFamilies: 0,
    totalUsers: 0,
    userNames: [],
    loading: true,
  });

  const [recentPlants, setRecentPlants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setStats(prev => ({ ...prev, loading: true }));
      try {
        // 1. Fetch Stats
        const [plantsRes, familiesRes, usersRes] = await Promise.all([
          plantService.getPlants([Query.limit(1)]), // Just to get total
          plantService.getFamilies([Query.limit(1)]),
          plantService.getUsers([Query.limit(5), Query.orderDesc("$createdAt")]), // Fetch recent users for names
        ]);

        // 2. Fetch Recent Plants
        const recentRes = await plantService.getPlants([
             Query.limit(5),
             Query.orderDesc("$createdAt")
        ]);
        
        // Process Recent Plants Images
        let mappedRecents = [];
        if(recentRes && recentRes.documents) {
             mappedRecents = await Promise.all(recentRes.documents.map(async (doc) => {
                const images = await plantService.getPlantImages(doc.$id);
                const imageUrl = images?.documents?.[0]?.url || "";
                return {
                    id: doc.$id,
                    name: (doc.common_names && doc.common_names.length > 0) ? doc.common_names[0] : (doc.name || "Unnamed"),
                    family: doc.family_name || "Unknown",
                    scientificName: doc.scientific_name || doc.species || "Unknown",
                    createdAt: doc.$createdAt,
                    image: imageUrl
                };
             }));
        }

        const userNames = usersRes ? usersRes.documents.map(u => u.name).filter(Boolean) : [];

        setStats({
          totalPlants: plantsRes ? plantsRes.total : 0,
          totalFamilies: familiesRes ? familiesRes.total : 0,
          totalUsers: usersRes ? usersRes.total : 0,
          userNames: userNames,
          loading: false,
        });
        
        setRecentPlants(mappedRecents);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const statCards = [
    {
      title: "Total Plants",
      value: stats.totalPlants,
      description: "Documented medicinal plants",
      icon: Sprout,
      color: "text-green-500",
    },
    {
      title: "Plant Families",
      value: stats.totalFamilies,
      description: "Botanical families categorised",
      icon: Leaf,
      color: "text-emerald-600",
    },
    {
      title: "Original Users",
      value: stats.totalUsers,
      description: stats.userNames.length > 0 ? stats.userNames.join(", ") : "No users found",
      icon: Users,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6 pt-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of the Harbloom medicinal plant database.
          </p>
        </div>
        <div className="hidden md:block">
            <Button asChild>
                <Link to="/admin/add-plant">Add New Plant</Link>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                  {stats.loading ? (
                       <span className="animate-pulse bg-muted rounded h-8 w-12 inline-block"/>
                  ) : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Eventually Added Plants</CardTitle>
                <CardDescription>
                    The 5 most recent additions to the database.
                </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
                <Link to="/admin/manage-plants" className="gap-1">
                    View All <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Plant</TableHead>
                        <TableHead>Family</TableHead>
                        <TableHead className="text-right">Added</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stats.loading ? (
                         Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><div className="h-10 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                            </TableRow>
                         ))
                    ) : recentPlants.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No plants added yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        recentPlants.map((plant) => (
                            <TableRow key={plant.id} className="group">
                                <TableCell className="flex items-center gap-3 font-medium">
                                     <Avatar className="h-9 w-9 rounded-lg border group-hover:scale-105 transition-transform">
                                        <AvatarImage src={plant.image} className="object-cover" />
                                        <AvatarFallback className="rounded-lg">{plant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>{plant.name}</span>
                                        <span className="text-xs text-muted-foreground font-normal italic">{plant.scientificName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{plant.family}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {new Date(plant.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
             </Table>
          </CardContent>
        </Card>

        {/* Quick Tips / Info Sidebar */}
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Button variant="secondary" className="justify-start w-full" asChild>
                        <Link to="/admin/add-plant"><Sprout className="mr-2 h-4 w-4"/> Add New Plant</Link>
                    </Button>
                     <Button variant="ghost" className="justify-start w-full" asChild>
                        <Link to="/admin/manage-plants"><LayoutDashboard className="mr-2 h-4 w-4"/> Manage Database</Link>
                    </Button>
                </div>
                
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">System Status</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Database Operational
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Storage Connected
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
