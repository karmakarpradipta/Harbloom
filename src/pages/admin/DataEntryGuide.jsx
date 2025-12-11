import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  AlertCircle,
  Info,
  CheckCircle2,
  Leaf,
  Sprout,
  FlaskConical,
  MapPin,
  ClipboardList,
  Search,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const DataEntryGuide = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/5">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Botanical Data Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Simple instructions for adding new plants to Harbloom.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 w-full">
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
          <Tabs defaultValue="workflow" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="workflow">Step-by-Step Workflow</TabsTrigger>
              <TabsTrigger value="glossary">Botanical Dictionary</TabsTrigger>
              <TabsTrigger value="examples">Examples & Tips</TabsTrigger>
              <TabsTrigger value="checklist">Full Checklist</TabsTrigger>
            </TabsList>

            {/* TAB 1: WORKFLOW */}
            <TabsContent value="workflow" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        1
                      </span>
                      Create Basics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Check if the <strong>Family</strong>,{" "}
                    <strong>Origin</strong>, and <strong>Habitat</strong> exist.
                    Create them first if they are missing.
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                      </span>
                      Build Profiles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Add <strong>Chemical</strong> or <strong>Medicinal</strong>{" "}
                    data if available. This keeps the main form clean.
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        3
                      </span>
                      Assemble
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Go to <strong>Add Plant</strong>, select the items you
                    created, upload photos, and save!
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> Detailed Steps
              </h3>
              <Accordion
                type="single"
                collapsible
                className="w-full bg-card rounded-xl border px-4"
              >
                <AccordionItem value="step-1">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex gap-4 text-left">
                      <Leaf className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-bold text-lg">
                          Step 1: Check the Family
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Every plant belongs to a family (like a surname).
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4 text-muted-foreground space-y-2">
                    <p>
                      Before adding a plant, search the{" "}
                      <strong>Families</strong> list.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>If it exists: Great! You're ready.</li>
                      <li>
                        If NOT: Click "Add Family". You just need the Latin name
                        (e.g., <em>Lamiaceae</em>).
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-2">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex gap-4 text-left">
                      <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <div className="font-bold text-lg">
                          Step 2: Region & Habitat
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Where does it grow?
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4 text-muted-foreground space-y-2">
                    <p>
                      We separate <strong>Origin</strong> (Geography) from{" "}
                      <strong>Habitat</strong> (Ecology).
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-bold text-foreground mb-1">
                          Origin (Where?)
                        </div>
                        Examples: "Southeast Asia", "Mediterranean", "Andes
                        Mountains".
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-bold text-foreground mb-1">
                          Habitat (How?)
                        </div>
                        Examples: "Tropical Rainforest", "Arid Desert", "River
                        Banks".
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-3">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex gap-4 text-left">
                      <FlaskConical className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-bold text-lg">
                          Step 3: Profiles (Optional)
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Chemical, Medicinal, and Cultivation details.
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4 text-muted-foreground space-y-2">
                    <p>
                      If you have scientific data, add it in the specialized
                      sections.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Chemical:</strong> Active compounds (e.g.,
                        Curcumin).
                      </li>
                      <li>
                        <strong>Medicinal:</strong> What does it cure? (e.g.,
                        Anti-inflammatory).
                      </li>
                      <li>
                        <strong>Cultivation:</strong> How to grow it? (e.g.,
                        Full Sun, Zone 10).
                      </li>
                    </ul>
                    <p className="text-xs italic mt-2">
                      Note: You can skip this for simple entries.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex gap-4 text-left">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="font-bold text-lg">
                          Step 4: The Main Form
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Putting it all together.
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4 text-muted-foreground space-y-2">
                    <p>
                      Navigate to <strong>Add New Plant</strong>.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Fill in the <strong>Scientific Name</strong> (Latin) and{" "}
                        <strong>Common Names</strong>.
                      </li>
                      <li>
                        Add <strong>Tags</strong> (e.g. 'Medicinal', 'Winter')
                        to help categorization.
                      </li>
                      <li>
                        Select the Family, Origin, and Habitat you checked
                        earlier.
                      </li>
                      <li>
                        Upload high-quality images. Cover image is the most
                        important!
                      </li>
                      <li>If you added Profiles in Step 3, link them now.</li>
                      <li>
                        Click <strong>Preview</strong> to check your work, then{" "}
                        <strong>Save</strong>.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* TAB 2: GLOSSARY */}
            <TabsContent value="glossary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" /> Botanical
                    Dictionary
                  </CardTitle>
                  <CardDescription>
                    Simple English explanations for scientific terms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-primary">
                        Naming
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-primary/20 pl-4 py-1">
                          <div className="font-bold">Genus (The Group)</div>
                          <p className="text-sm text-muted-foreground">
                            Think of this as a surname. All roses belong to the
                            genus <em>Rosa</em>.
                          </p>
                        </div>
                        <div className="border-l-4 border-primary/20 pl-4 py-1">
                          <div className="font-bold">
                            Species (The Individual)
                          </div>
                          <p className="text-sm text-muted-foreground">
                            The specific name. <em>Rosa damascena</em> is a
                            specific type of rose.
                          </p>
                        </div>
                        <div className="border-l-4 border-primary/20 pl-4 py-1">
                          <div className="font-bold">Cultivar</div>
                          <p className="text-sm text-muted-foreground">
                            A variety created by humans, usually written in
                            quotes like 'Peace'.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2 text-primary">
                        Plant Parts
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500/20 pl-4 py-1">
                          <div className="font-bold">Rhizome</div>
                          <p className="text-sm text-muted-foreground">
                            A root that grows underground sideways (like Ginger
                            or Turmeric). It's not just a root!
                          </p>
                        </div>
                        <div className="border-l-4 border-green-500/20 pl-4 py-1">
                          <div className="font-bold">Aerial Parts</div>
                          <p className="text-sm text-muted-foreground">
                            Anything growing above ground (Leaves, Stems,
                            Flowers mixed together).
                          </p>
                        </div>
                        <div className="border-l-4 border-green-500/20 pl-4 py-1">
                          <div className="font-bold">Resin</div>
                          <p className="text-sm text-muted-foreground">
                            Sticky sap that hardens (like Frankincense). Often
                            used for incense.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: EXAMPLES */}
            <TabsContent value="examples" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* GOOD EXAMPLE */}
                <Card className="border-green-500/20 bg-green-50/10">
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" /> Good Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Scientific Name
                      </div>
                      <div className="font-serif italic text-lg">
                        Ocimum sanctum
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Common Names
                      </div>
                      <div>Holy Basil, Tulsi, Sacred Basil</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Comma separated, Capitalized)
                      </p>
                    </div>
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Description
                      </div>
                      <p className="italic">
                        "A aromatic perennial plant in the family Lamiaceae. It
                        is native to the Indian subcontinent..."
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* BAD EXAMPLE */}
                <Card className="border-red-500/20 bg-red-50/10">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Bad Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Scientific Name
                      </div>
                      <div className="line-through decoration-red-500 decoration-2">
                        OCIMUM SANCTUM
                      </div>
                      <p className="text-xs text-red-500 mt-1">
                        Don't use ALL CAPS.
                      </p>
                    </div>
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Common Names
                      </div>
                      <div className="line-through decoration-red-500 decoration-2">
                        tulsi and holy basil
                      </div>
                      <p className="text-xs text-red-500 mt-1">
                        Capitalize names. Use commas, not "and".
                      </p>
                    </div>
                    <div>
                      <div className="font-bold text-muted-foreground uppercase text-xs">
                        Description
                      </div>
                      <div className="line-through decoration-red-500 decoration-2">
                        its a good plant for tea.
                      </div>
                      <p className="text-xs text-red-500 mt-1">
                        Too short. Be descriptive!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 4: CHECKLIST */}
            <TabsContent value="checklist" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" /> Identity &
                      Classification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4">
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">
                        scientific_name
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Latin name (e.g., <em>Ocimum sanctum</em>)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">
                        common_names
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        List of local names (English, Sanskrit, etc.)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">genus</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Taxonomic rank (e.g., <em>Ocimum</em>)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">species</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Specific epithet (e.g., <em>sanctum</em>)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2 pt-1">
                      <span className="font-semibold text-sm">plant_type</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Herb, Shrub, Tree, Creeper, etc.
                      </span>
                    </div>
                    <div className="flex items-start justify-between pt-1">
                      <span className="font-semibold text-sm">tags</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Keywords like 'Seasonal', 'Fast Growing', 'Sacred'
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-amber-500/5 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-600" /> Ecology &
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4">
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">family</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Botanical family ID (must be pre-created)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">origin</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Geographic region ID (must be pre-created)
                      </span>
                    </div>
                    <div className="flex items-start justify-between pt-1">
                      <span className="font-semibold text-sm">habitat</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Ecological zone ID (must be pre-created)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-blue-500/5 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-blue-600" />{" "}
                      Profiles (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4">
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">
                        chemical_profile
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Link to Chemical Constituents document
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">
                        medicinal_profile
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Link to Therapeutic Uses document
                      </span>
                    </div>
                    <div className="flex items-start justify-between pt-1">
                      <span className="font-semibold text-sm">
                        cultivation_profile
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Link to Growing Requirements document
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-500/5 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Core
                      Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4">
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">
                        short_description
                      </span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        1-2 paragraph introduction (Rich Text)
                      </span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <span className="font-semibold text-sm">images</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Array of URLs + Captions + Licenses
                      </span>
                    </div>
                    <div className="flex items-start justify-between pt-1">
                      <span className="font-semibold text-sm">parts_data</span>
                      <span className="text-xs text-muted-foreground w-1/2 text-right">
                        Specific parts (e.g., Leaf) + Usages + Part Images
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DataEntryGuide;
