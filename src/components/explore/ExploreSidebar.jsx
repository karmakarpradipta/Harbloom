import { ScrollArea } from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {motion} from "framer-motion";
import { Button } from "@/components/ui/button";


const ExploreSidebar = ({ isOpen, toggleSidebar }) => {
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
          {/* Medicinal Uses */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Medicinal Uses
            </h3>
            <div className="space-y-3">
              {[
                "Digestive Health",
                "Immunity",
                "Skin Care",
                "Stress Relief",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="h-4 w-4 rounded border border-input bg-background group-hover:border-primary transition-colors flex items-center justify-center">
                    {/* Checkbox indicator would go here */}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Plant Systems */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Plant Systems
            </h3>
            <div className="space-y-3">
              {["Ayurveda", "Homeopathy", "Unani", "Siddha"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="h-4 w-4 rounded border border-input bg-background group-hover:border-primary transition-colors"></div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Alphabetical */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Alphabetical
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded cursor-pointer">
                A-Z
              </span>
              <span className="px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted rounded cursor-pointer transition-colors">
                Z-A
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 mt-auto border-t border-border space-y-3">
        <Button className="w-full font-bold shadow-md">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </aside>
  );
};

export default ExploreSidebar;
