import { ScrollArea } from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {motion} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useExplore } from "@/context/ExploreContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


const ExploreSidebar = ({ isOpen, toggleSidebar }) => {
  const { filters, selectedFilters, toggleFamily, toggleHabitat, resetFilters } = useExplore();

  return (
    <aside
      className={`fixed left-0 top-0 h-[100dvh] w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col z-[60] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-6">
        <motion.div layoutId="brand-logo" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            spa
          </span>
          <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Harbloom
          </span>
        </motion.div>
        <motion.div layoutId="menu-toggle-button">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined">close</span>
          </Button>
        </motion.div>
      </div>

      <ScrollArea className="flex-1 px-6 overflow-hidden">
        <div className="space-y-8 pb-6">
          {/* Families */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Families
            </h3>
            <div className="space-y-3">
              {filters.families.length === 0 && <p className="text-xs text-muted-foreground">Loading families...</p>}
              {filters.families.map((family) => (
                <div key={family.$id} className="flex items-center space-x-2">
                   <Checkbox 
                        id={family.$id} 
                        checked={selectedFilters.families.includes(family.$id)}
                        onCheckedChange={() => toggleFamily(family.$id)}
                   />
                   <Label htmlFor={family.$id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {family.name}
                   </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Habitats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Habitats
            </h3>
             <div className="space-y-3">
              {filters.habitats.length === 0 && <p className="text-xs text-muted-foreground">Loading habitats...</p>}
              {filters.habitats.map((habitat) => (
                <div key={habitat.$id} className="flex items-center space-x-2">
                   <Checkbox 
                        id={habitat.$id} 
                        checked={selectedFilters.habitats.includes(habitat.$id)}
                        onCheckedChange={() => toggleHabitat(habitat.$id)}
                   />
                    <Label htmlFor={habitat.$id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {habitat.climate} {habitat.soil_type ? `- ${habitat.soil_type}` : ""}
                   </Label>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </ScrollArea>

      <div className="p-6 mt-auto border-t border-border space-y-3">
        <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset Filters
        </Button>
      </div>
    </aside>
  );
};

export default ExploreSidebar;
