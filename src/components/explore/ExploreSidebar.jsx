import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useExplore } from "@/context/ExploreContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ExploreSidebar = () => {
  const { filters, selectedFilters, toggleFamily, toggleHabitat, toggleOrigin, toggleMedicinalUsage, resetFilters } = useExplore();

  return (
    <Sidebar collapsible="offcanvas" variant="overlay" className="border-r border-border bg-card/50 backdrop-blur-xl z-[45]">
      <SidebarHeader className="h-20 flex justify-center px-6">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-3xl shrink-0">
            filter_alt
          </span>
          <span className="text-2xl font-serif font-bold tracking-tight text-foreground transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
            Filters
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* Families */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            Families
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {filters.families.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading families...</p>
              )}
              {filters.families.map((family) => (
                <div key={family.$id} className="flex items-center space-x-2">
                  <Checkbox
                    id={family.$id}
                    checked={selectedFilters.families.includes(family.$id)}
                    onCheckedChange={() => toggleFamily(family.$id)}
                  />
                  <Label
                    htmlFor={family.$id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {family.name}
                  </Label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Medicinal Usage */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            Medicinal Uses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {filters.medicinalUsages.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading usages...</p>
              )}
              {filters.medicinalUsages.map((usage, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`usage-${idx}`}
                    checked={selectedFilters.medicinalUsages.includes(usage)}
                    onCheckedChange={() => toggleMedicinalUsage(usage)}
                  />
                  <Label
                    htmlFor={`usage-${idx}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {usage}
                  </Label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Regions / Countries (Origins) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            Regions / Countries
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {filters.origins.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading regions...</p>
              )}
              {filters.origins.map((origin) => (
                <div key={origin.$id} className="flex items-center space-x-2">
                  <Checkbox
                    id={origin.$id}
                    checked={selectedFilters.origins.includes(origin.$id)}
                    onCheckedChange={() => toggleOrigin(origin.$id)}
                  />
                  <Label
                    htmlFor={origin.$id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {origin.name}
                  </Label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Habitats (Climate) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            Climate / Habitat
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {filters.habitats.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading habitats...</p>
              )}
              {filters.habitats.map((habitat) => (
                <div key={habitat.$id} className="flex items-center space-x-2">
                  <Checkbox
                    id={habitat.$id}
                    checked={selectedFilters.habitats.includes(habitat.$id)}
                    onCheckedChange={() => toggleHabitat(habitat.$id)}
                  />
                  <Label
                    htmlFor={habitat.$id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {habitat.climate} {habitat.soil_type ? `- ${habitat.soil_type}` : ""}
                  </Label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button variant="outline" className="w-full group-data-[collapsible=icon]:hidden" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Button variant="ghost" size="icon" className="w-full hidden group-data-[collapsible=icon]:flex" onClick={resetFilters}>
            <span className="material-symbols-outlined">restart_alt</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default ExploreSidebar;
