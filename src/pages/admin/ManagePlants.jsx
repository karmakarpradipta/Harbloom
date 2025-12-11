import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadcareWrapper from "@/components/common/UploadcareWrapper";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RichTextDisplay from "@/components/common/RichTextDisplay";
import plantService from "@/services/plantService";
import { useNavigate } from "react-router-dom";

const ManagePlants = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPlant, setCurrentPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    description: "",
    image: "",
  });

  const [plants, setPlants] = useState([]);

  const fetchPlants = async () => {
    try {
      const response = await plantService.getPlants();
      if (response && response.documents) {
        // Map Appwrite documents to local state format
        const mappedPlants = response.documents.map((doc) => ({
          id: doc.$id,
          name:
            doc.commonNames && doc.commonNames.length > 0
              ? doc.commonNames[0]
              : "Unnamed",
          scientificName: doc.scientificName,
          description: doc.shortDescription,
          image: "", // Placeholder
          raw: doc, // Keep raw doc for reference
        }));
        setPlants(mappedPlants);

        // Fetch images for each plant
        const updatedPlants = await Promise.all(
          mappedPlants.map(async (plant) => {
            const images = await plantService.getPlantImages(plant.id);
            if (images && images.documents.length > 0) {
              return { ...plant, image: images.documents[0].url };
            }
            return plant;
          })
        );
        setPlants(updatedPlants);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to load plants.");
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleOpenDialog = (plant = null) => {
    // For now, redirect Add to the dedicated page
    if (!plant) {
      navigate("/admin/add-plant");
      return;
    }
    // Edit logic remains here for now (or TODO)
    setCurrentPlant(plant);
    setFormData({
      name: plant.name,
      scientificName: plant.scientificName,
      description: plant.description,
      image: plant.image,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast.info("Editing not fully implemented here yet. Use Add Plant.");
    setIsDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this plant?")) {
      const success = await plantService.deletePlant(id);
      if (success) {
        toast.success("Plant deleted successfully.");
        fetchPlants();
      } else {
        toast.error("Failed to delete plant.");
      }
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Plants</h1>
          <p className="text-muted-foreground">
            View, add, edit, and delete medicinal plants.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/add-plant")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Plant
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Scientific Name
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No plants found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage src={plant.image} className="object-cover" />
                      <AvatarFallback className="rounded-lg">
                        {plant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{plant.name}</TableCell>
                  <TableCell className="hidden md:table-cell italic text-muted-foreground">
                    {plant.scientificName}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs">
                    <RichTextDisplay
                      content={plant.description}
                      className="line-clamp-2 text-sm [&_p]:m-0"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(plant)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(plant.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentPlant ? "Edit Plant" : "Add New Plant"}
            </DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Plant Image</Label>
              <div className="flex justify-center border-2 border-dashed rounded-lg p-4">
                {formData.image ? (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <UploadcareWrapper
                    onUploadSuccess={(fileInfo) =>
                      setFormData({ ...formData, image: fileInfo.cdnUrl })
                    }
                  />
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Tulsi"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scientificName">Scientific Name</Label>
              <Input
                id="scientificName"
                value={formData.scientificName}
                onChange={(e) =>
                  setFormData({ ...formData, scientificName: e.target.value })
                }
                placeholder="e.g. Ocimum tenuiflorum"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the plant..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePlants;
