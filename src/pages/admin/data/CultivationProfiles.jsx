import React, { useEffect, useState } from "react";
import CultivationForm from "@/components/forms/CultivationForm";
import PropagationForm from "@/components/forms/PropagationForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CultivationProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [propagationMethods, setPropagationMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const formRef = React.useRef(null);
  const propagationFormRef = React.useRef(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const [cultivationRes, propagationRes] = await Promise.all([
        plantService.getCultivationProfiles(),
        plantService.getPropagationMethods(),
      ]);

      if (cultivationRes?.documents) {
        setProfiles(cultivationRes.documents);
      }
      if (propagationRes?.documents) {
        setPropagationMethods(propagationRes.documents);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deleteCultivationProfile(id);
      if (success) {
        toast.success("Profile deleted");
        fetchProfiles();
      } else {
        toast.error("Failed to delete profile");
      }
    } catch (error) {
      toast.error("Error deleting profile");
    }
  };

  const handleDeletePropagation = async (id) => {
    try {
      const success = await plantService.deletePropagationMethod(id);
      if (success) {
        toast.success("Method deleted");
        fetchProfiles();
      } else {
        toast.error("Failed to delete method");
      }
    } catch (error) {
      toast.error("Error deleting method");
    }
  };

  const columns = [
    {
      header: "Land Preparation",
      accessorKey: "land_preparation",
      render: (item) => (
        <div className="max-w-[200px] truncate" title={item.land_preparation}>
          {item.land_preparation || "-"}
        </div>
      ),
    },
    {
      header: "Sowing Time",
      accessorKey: "sowing_time",
      render: (item) => (
        <div className="max-w-[200px] truncate" title={item.sowing_time}>
          {item.sowing_time || "-"}
        </div>
      ),
    },
    {
      header: "Yield Info",
      accessorKey: "yield_info",
      render: (item) => (
        <div className="max-w-[150px] truncate" title={item.yield_info}>
          {item.yield_info || "-"}
        </div>
      ),
    },
  ];

  const propagationColumns = [
    {
      header: "Method",
      accessorKey: "method_name",
      className: "font-medium",
    },
    {
      header: "Difficulty",
      accessorKey: "difficulty",
    },
    {
      header: "Season",
      accessorKey: "season",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/5">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Cultivation Data
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Manage propagation methods and growth requirements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="hidden sm:flex"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 w-full bg-muted/5">
        <div className="max-w-5xl mx-auto p-6 w-full space-y-8">
          <Tabs defaultValue="req" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-background/40 backdrop-blur-md border border-white/10">
                <TabsTrigger value="req">Requirements</TabsTrigger>
                <TabsTrigger value="propagation">Propagation</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="req" className="space-y-8">
              {/* Create New Section */}
              <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">
                    Add Growth Requirements
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => formRef.current?.clear()}
                  >
                    Clear
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <CultivationForm ref={formRef} onSuccess={fetchProfiles} />
                </CardContent>
              </Card>

              {/* List Section */}
              <DataList
                title="Existing Requirements"
                description="List of all cultivation profiles."
                data={profiles}
                columns={columns}
                loading={loading}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="propagation" className="space-y-8">
              <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">
                    Add Propagation Method
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => propagationFormRef.current?.clear()}
                  >
                    Clear
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <PropagationForm
                    ref={propagationFormRef}
                    onSuccess={() => {
                      toast.success("Propagation saved!");
                      fetchProfiles();
                    }}
                  />
                </CardContent>
              </Card>

              <DataList
                title="Existing Methods"
                description="List of propagation methods."
                data={propagationMethods}
                columns={propagationColumns}
                loading={loading}
                onDelete={handleDeletePropagation}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="h-6" /> {/* Spacer */}
      </ScrollArea>
    </div>
  );
};

export default CultivationProfiles;
