import React, { useEffect, useState } from "react";
import OriginForm from "@/components/forms/OriginForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Origins = () => {
  const navigate = useNavigate();
  const [origins, setOrigins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const formRef = React.useRef(null);

  const fetchOrigins = async () => {
    setLoading(true);
    try {
      const response = await plantService.getOrigins();
      if (response?.documents) {
        setOrigins(response.documents);
      }
    } catch (error) {
      toast.error("Failed to fetch origins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrigins();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deleteOrigin(id);
      if (success) {
        toast.success("Origin deleted");
        fetchOrigins();
        if (editingItem && editingItem.$id === id) {
          setEditingItem(null);
        }
      } else {
        toast.error("Failed to delete origin");
      }
    } catch (error) {
      toast.error("Error deleting origin");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    {
      header: "Region",
      accessorKey: "region",
      className: "font-medium",
    },
    {
      header: "Countries",
      accessorKey: "countries",
      className: "text-muted-foreground",
      render: (item) => (
        <span>
          {item.countries && item.countries.length > 0
            ? item.countries.join(", ")
            : item.country || "-"}
        </span>
      ),
    },
    {
      header: "Specifics",
      accessorKey: "notes",
      className: "hidden md:table-cell text-muted-foreground",
      render: (item) => (
        <div className="max-w-[300px] truncate" title={item.notes}>
          {item.notes || "-"}
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
              Manage Origins
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Add and view geographical origins.
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
                {editingItem ? "Edit Origin" : "Add New Origin"}
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
              <OriginForm
                ref={formRef}
                initialData={editingItem}
                onSuccess={() => {
                  fetchOrigins();
                  setEditingItem(null);
                }}
                onCancel={editingItem ? () => setEditingItem(null) : undefined}
              />
            </CardContent>
          </Card>

          {/* List Section */}
          <DataList
            title="Existing Origins"
            description="List of all registered geographical origins."
            data={origins}
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

export default Origins;
