import React, { useEffect, useState } from "react";
import MedicinalProfileForm from "@/components/forms/MedicinalProfileForm";
import AyurvedicPropertiesForm from "@/components/forms/AyurvedicPropertiesForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const MedicinalProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [ayurvedicProps, setAyurvedicProps] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const formRef = React.useRef(null);
  const ayurvedicFormRef = React.useRef(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const [medicinalRes, ayurvedicRes] = await Promise.all([
        plantService.getMedicinalProfiles(),
        plantService.getAyurvedicProperties(),
      ]);

      if (medicinalRes?.documents) {
        setProfiles(medicinalRes.documents);
      }
      if (ayurvedicRes?.documents) {
        setAyurvedicProps(ayurvedicRes.documents);
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

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deleteMedicinalProfile(id);
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

  const handleDeleteAyurvedic = async (id) => {
    try {
      const success = await plantService.deleteAyurvedicProperty(id);
      if (success) {
        toast.success("Property deleted");
        fetchProfiles();
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      toast.error("Error deleting property");
    }
  };

  const columns = [
    {
      header: "Traditional Uses",
      accessorKey: "traditional_uses",
      render: (item) => (
        <div className="max-w-[250px] truncate" title={item.traditional_uses}>
          {item.traditional_uses || "N/A"}
        </div>
      ),
    },
    {
      header: "Modern Uses",
      accessorKey: "modern_uses",
      render: (item) => (
        <div className="max-w-[250px] truncate" title={item.modern_uses}>
          {item.modern_uses || "-"}
        </div>
      ),
    },
  ];

  const ayurvedicColumns = [
    {
      header: "Rasa",
      accessorKey: "rasa",
      render: (item) => (
        <div
          className="max-w-[150px] truncate"
          title={Array.isArray(item.rasa) ? item.rasa.join(", ") : item.rasa}
        >
          {Array.isArray(item.rasa) ? item.rasa.join(", ") : item.rasa || "-"}
        </div>
      ),
    },
    {
      header: "Virya",
      accessorKey: "virya",
    },
    {
      header: "Vipaka",
      accessorKey: "vipaka",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/5">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Medicinal Profiles
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Manage medicinal uses and traditional ayurvedic properties.
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
          <Tabs defaultValue="modern" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-background/40 backdrop-blur-md border border-white/10">
                <TabsTrigger value="modern">Medicinal Profile</TabsTrigger>
                <TabsTrigger value="ayurveda">Ayurvedic Properties</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="modern" className="space-y-8">
              {/* Create New Section */}
              <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">
                    {editingItem
                      ? "Edit Medicinal Profile"
                      : "Add New Medicinal Profile"}
                  </CardTitle>
                  {!editingItem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => formRef.current?.clear()}
                    >
                      Clear
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <MedicinalProfileForm
                    ref={formRef}
                    initialData={editingItem}
                    onSuccess={() => {
                      fetchProfiles();
                      setEditingItem(null);
                    }}
                    onCancel={() => {
                      setEditingItem(null);
                      formRef.current?.clear();
                    }}
                  />
                </CardContent>
              </Card>

              {/* List Section */}
              <DataList
                title="Existing Profiles"
                description="List of all registered medicinal profiles."
                data={profiles}
                columns={columns}
                loading={loading}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </TabsContent>

            <TabsContent value="ayurveda" className="space-y-8">
              <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">
                    Add Ayurvedic Properties
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => ayurvedicFormRef.current?.clear()}
                  >
                    Clear
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* Note: Ayurvedic might need its own list/delete logic or be part of Medicinal Profile */}
                  <AyurvedicPropertiesForm
                    ref={ayurvedicFormRef}
                    onSuccess={() => {
                      toast.success("Ayurvedic properties saved!");
                      fetchProfiles();
                    }}
                  />
                </CardContent>
              </Card>

              <DataList
                title="Existing Properties"
                description="List of registered ayurvedic properties."
                data={ayurvedicProps}
                columns={ayurvedicColumns}
                loading={loading}
                onDelete={handleDeleteAyurvedic}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="h-6" /> {/* Spacer */}
      </ScrollArea>
    </div>
  );
};
/* ... */

export default MedicinalProfiles;
