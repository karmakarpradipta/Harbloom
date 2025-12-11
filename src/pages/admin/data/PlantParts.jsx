import React, { useEffect, useState } from "react";
import PlantPartForm from "@/components/forms/PlantPartForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RichTextDisplay from "@/components/common/RichTextDisplay";

const PlantParts = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const formRef = React.useRef(null);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await plantService.getPlantParts();
      if (response?.documents) {
        setParts(response.documents);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch plant parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deletePlantPart(id);
      if (success) {
        toast.success("Plant part deleted");
        fetchParts();
        if (editingItem && editingItem.$id === id) {
          setEditingItem(null);
        }
      } else {
        toast.error("Failed to delete part");
      }
    } catch (error) {
      toast.error("Error deleting part");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    {
      header: "Part Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Description",
      accessorKey: "description",
      render: (item) => (
        <div className="max-w-[300px] truncate" title={item.description}>
          {item.description || <span className="text-muted-foreground">-</span>}
        </div>
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
              Plant Parts
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Manage standardized plant parts, their images, and common uses.
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
              <CardTitle className="text-lg">
                {editingItem ? "Edit Plant Part" : "Add New Plant Part"}
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
              <PlantPartForm
                ref={formRef}
                initialData={editingItem}
                onSuccess={() => {
                  fetchParts();
                  setEditingItem(null);
                }}
                onCancel={editingItem ? () => setEditingItem(null) : undefined}
              />
            </CardContent>
          </Card>

          {/* List Section */}
          <DataList
            title="Existing Plant Parts"
            description="List of all registered plant parts."
            data={parts}
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

export default PlantParts;
