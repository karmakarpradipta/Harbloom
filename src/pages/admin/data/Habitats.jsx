import React, { useEffect, useState } from "react";
import HabitatForm from "@/components/forms/HabitatForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Habitats = () => {
  const navigate = useNavigate();
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const formRef = React.useRef(null);

  const fetchHabitats = async () => {
    setLoading(true);
    try {
      const response = await plantService.getHabitats();
      if (response?.documents) {
        setHabitats(response.documents);
      }
    } catch (error) {
      toast.error("Failed to fetch habitats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitats();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deleteHabitat(id);
      if (success) {
        toast.success("Habitat deleted");
        fetchHabitats();
        if (editingItem && editingItem.$id === id) {
          setEditingItem(null);
        }
      } else {
        toast.error("Failed to delete habitat");
      }
    } catch (error) {
      toast.error("Error deleting habitat");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    {
      header: "Climate",
      accessorKey: "climate",
      className: "font-medium",
    },
    {
      header: "Typ. Habitats",
      accessorKey: "typical_habitates",
      className: "hidden md:table-cell text-muted-foreground",
      render: (item) => (
        <div className="max-w-[150px] truncate" title={item.typical_habitates}>
          {item.typical_habitates || "-"}
        </div>
      ),
    },
    {
      header: "Temp (°C)",
      id: "temp",
      className: "hidden lg:table-cell text-muted-foreground",
      render: (item) => (
        <span>
          {item.temperature_min ?? "?"} - {item.temperature_max ?? "?"}
        </span>
      ),
    },
    {
      header: "Soil",
      accessorKey: "soil_type",
      className: "hidden md:table-cell text-muted-foreground",
    },
    {
      header: "Rainfall (mm)",
      id: "rain",
      className: "hidden xl:table-cell text-muted-foreground",
      render: (item) => (
        <span>
          {item.rainfall_min ?? "?"} - {item.rainfall_max ?? "?"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/5">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manage Habitats
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Add and view plant habitat profiles.
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
          {/* Create New Section */}
          <Card className="border-white/20 shadow-xl bg-background/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {editingItem ? "Edit Habitat" : "Add New Habitat"}
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
              <HabitatForm
                ref={formRef}
                initialData={editingItem}
                onSuccess={() => {
                  fetchHabitats();
                  setEditingItem(null);
                }}
                onCancel={editingItem ? () => setEditingItem(null) : undefined}
              />
            </CardContent>
          </Card>

          {/* List Section */}
          <DataList
            title="Existing Habitats"
            description="List of all registered plant habitats."
            data={habitats}
            columns={columns}
            loading={loading}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
        <div className="h-6" /> {/* Spacer */}
      </ScrollArea>
    </div>
  );
};

export default Habitats;
