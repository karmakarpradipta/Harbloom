import React, { useEffect, useState } from "react";
import TagForm from "@/components/forms/TagForm";
import DataList from "@/components/common/DataList";
import plantService from "@/services/plantService";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

const Tags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const formRef = React.useRef(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await plantService.getTags();
      if (response?.documents) {
        setTags(response.documents);
      }
    } catch (error) {
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await plantService.deleteTag(id);
      if (success) {
        toast.success("Tag deleted");
        fetchTags();
        if (editingItem && editingItem.$id === id) {
          setEditingItem(null);
        }
      } else {
        toast.error("Failed to delete tag");
      }
    } catch (error) {
      toast.error("Error deleting tag");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Type",
      accessorKey: "type",
      className: "hidden sm:table-cell",
      render: (item) => (
        <Badge variant="outline">{item.type || "General"}</Badge>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "hidden md:table-cell text-muted-foreground",
      render: (item) => (
        <div className="max-w-[300px] truncate" title={item.description}>
          {item.description || "-"}
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
              Manage Tags
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Add and view plant tags.
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
                {editingItem ? "Edit Tag" : "Add New Tag"}
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
              <TagForm
                ref={formRef}
                initialData={editingItem}
                onSuccess={() => {
                  fetchTags();
                  setEditingItem(null);
                }}
                onCancel={editingItem ? () => setEditingItem(null) : undefined}
              />
            </CardContent>
          </Card>

          {/* List Section */}
          <DataList
            title="Existing Tags"
            description="List of all registered plant tags."
            data={tags}
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

export default Tags;
