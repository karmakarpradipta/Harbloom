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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import plantService from "@/services/plantService";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";

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
  const [totalPlants, setTotalPlants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPlants = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const queries = [
        Query.limit(itemsPerPage),
        Query.offset(offset),
        Query.orderDesc("$createdAt")
      ];
      
      if (searchTerm) {
        queries.push(Query.search("name", searchTerm));
      }

      const response = await plantService.getPlants(queries);
      
      if (response) {
        setTotalPlants(response.total);
        
        // Map Appwrite documents to local state format
        const mappedPlants = response.documents.map((doc) => ({
          id: doc.$id,
          // attributes are snake_case in Appwrite response usually
          name: (doc.common_names && doc.common_names.length > 0) ? doc.common_names.join(", ") : (doc.commonNames && doc.commonNames.length > 0 ? doc.commonNames.join(", ") : (doc.name || "Unnamed")),
          family: doc.family_name || doc.familyName || (typeof doc.family === 'object' ? doc.family?.name : "Unknown"),
          species: doc.scientific_name || doc.scientificName || doc.species || "Unknown", // scientific_name is the attribute in schema
          image: "", // Placeholder
          raw: doc,
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
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if(currentPage !== 1) {
            setCurrentPage(1); // Will trigger fetch via other effect
        } else {
            fetchPlants();
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Refetch when pagination changes
  useEffect(() => {
    fetchPlants();
  }, [currentPage, itemsPerPage]);


  const handleOpenDialog = (plant = null) => {
    if (!plant) {
      navigate("/admin/add-plant");
      return;
    }
    setCurrentPlant(plant);
    setFormData({
      name: plant.name,
      scientificName: plant.raw.scientificName,
      description: plant.raw.shortDescription,
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

  const totalPages = Math.ceil(totalPlants / itemsPerPage);

  return (
    <div className="space-y-6 pt-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Plants</h1>
          <p className="text-muted-foreground mt-1">
            View, add, edit, and delete medicinal plants database.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/add-plant")} className="shadow-sm hover:shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add New Plant
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Rows per page</span>
            <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                }}
            >
                <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] text-center font-bold text-foreground/80">#</TableHead>
              <TableHead className="w-[100px] font-bold text-foreground/80">Image</TableHead>
              <TableHead className="font-bold text-foreground/80">Common Names</TableHead>
              <TableHead className="font-bold text-foreground/80">Scientific Name</TableHead>
              <TableHead className="font-bold text-foreground/80">Family</TableHead>
              <TableHead className="text-right font-bold text-foreground/80 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-muted/50">
                    <TableCell><div className="h-4 w-6 mx-auto bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-10 w-10 bg-muted animate-pulse rounded-lg" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-8 w-8 ml-auto bg-muted animate-pulse rounded" /></TableCell>
                </TableRow>
               ))
            ) : plants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="bg-muted/50 p-4 rounded-full">
                            <Search className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium">No plants found</p>
                        <p className="text-sm opacity-80">Try adjusting your search or add a new plant.</p>
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("")} className="mt-2">
                            Clear Search
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ) : (
              plants.map((plant, index) => (
                <TableRow key={plant.id} className="group hover:bg-muted/30 transition-colors border-b border-muted/50 last:border-0">
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    {plant.image ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-muted group-hover:shadow-sm transition-all group-hover:scale-110">
                            <img 
                                src={plant.image} 
                                alt={plant.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : ( 
                        <Avatar className="h-12 w-12 rounded-lg border bg-muted group-hover:shadow-sm transition-all">
                            <AvatarFallback className="rounded-lg bg-primary/5 text-primary">
                                {plant.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                      <span className="font-semibold text-foreground text-base">{plant.name}</span>
                  </TableCell>
                  <TableCell>
                      <span className="italic text-muted-foreground">{plant.species}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{plant.family}</span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 hover:bg-background hover:shadow-sm transition-all">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(plant)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          onClick={() => handleDelete(plant.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Plant
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

    {/* Pagination */}
    {totalPages > 1 && (
        <div className="flex justify-center mt-8 pb-8">
            <Pagination>
            <PaginationContent>
                <PaginationItem>
                <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(p => p - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    if (
                        p === 1 ||
                        p === totalPages ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                         return (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                     if (
                        (p === currentPage - 2 && p > 1) ||
                        (p === currentPage + 2 && p < totalPages)
                     ) {
                         return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>;
                     }
                     return null;
                })}

                <PaginationItem>
                <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(p => p + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
                </PaginationItem>
            </PaginationContent>
            </Pagination>
        </div>
    )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentPlant ? "Edit Plant" : "Add New Plant"}
            </DialogTitle>
            <DialogDescription>Make changes to the plant details here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Plant Image</Label>
              <div className="flex justify-center border-2 border-dashed rounded-xl p-6 bg-muted/20">
                {formData.image ? (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-lg shadow-sm"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <Trash2 className="h-4 w-4" />
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
              <Label htmlFor="name">Common Name</Label>
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
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the plant..."
                className="h-24"
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
