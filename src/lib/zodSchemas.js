import { z } from "zod";

// Helper for optional string arrays
const optionalStringArray = z.array(z.string()).optional();
const requiredStringArray = z.array(z.string());

// 1. Families
export const familySchema = z.object({
  name: z.string().min(1, "Name is required"),
  author_citation: z.string().optional(),
  description: z.string().optional(),
});

// 2. Plant Parts
export const plantPartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

// 3. Tags
export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  description: z.string().optional(),
});

// 4. Chemical Constituents
export const chemicalConstituentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  class: z.string().optional(),
  formula: z.string().optional(),
  cas_number: z.string().optional(),
  description: z.string().optional(),
  pubchem_cid: z.string().optional(),
});

// 5. Origins
export const originSchema = z.object({
  region: z.string().optional(),
  countries: optionalStringArray,
  native_status: z.string().optional(), // 'Native', 'Introduced', etc.
  notes: z.string().optional(),
});

// 6. Habitats
export const habitatSchema = z.object({
  climate: z.string().optional(),
  temperature_min: z.coerce.number().optional(),
  temperature_max: z.coerce.number().optional(),
  soil_type: z.string().optional(),
  soil_ph_min: z.coerce.number().optional(),
  soil_ph_max: z.coerce.number().optional(),
  light: z.string().optional(), // 'Full Sun', 'Partial Shade'
  rainfall_min: z.coerce.number().optional(),
  rainfall_max: z.coerce.number().optional(),
  typical_habitats: z.string().optional(),
});

// 7. Ayurvedic Properties
export const ayurvedicPropertiesSchema = z.object({
  tridoshic: z.boolean().optional(),
  rasa: optionalStringArray, // Taste
  virya: z.string().optional(), // Potency
  vipaka: z.string().optional(), // Post-digestive effect
  dosha_effect_vata: z.string().optional(),
  dosha_effect_pitta: z.string().optional(),
  dosha_effect_kapha: z.string().optional(),
  classical_references: optionalStringArray,
});

// 8. Chemical Profiles
export const chemicalProfileSchema = z.object({
  overview: z.string().optional(),
  main_constituents: optionalStringArray,
  notes: z.string().optional(),
});

// 9. Medicinal Profiles
export const medicinalProfileSchema = z.object({
  traditional_uses: z.string().optional(),
  modern_uses: z.string().optional(),
  systems: optionalStringArray,
  actions: optionalStringArray,
  notes: z.string().optional(),
});

// 10. Propagation Methods
export const propagationMethodSchema = z.object({
  methods: optionalStringArray, // 'Seed', 'Cutting', etc.
  details: z.string().optional(),
  seed_treatment: z.string().optional(),
  germination_time: z.string().optional(),
  vegetative_method_notes: z.string().optional(),
});

// 11. Cultivation Requirements
export const cultivationRequirementSchema = z.object({
  land_preparation: z.string().optional(),
  sowing_time: z.string().optional(),
  spacing: z.string().optional(),
  irrigation: z.string().optional(),
  fertilizer: z.string().optional(),
  harvest_time: z.string().optional(),
  yield_info: z.string().optional(),
});

// 12. Plant Morphology
export const plantMorphologySchema = z.object({
  habit: z.string().optional(), // 'Herb', 'Shrub', 'Tree'
  root_description: z.string().optional(),
  stem_description: z.string().optional(),
  leaf_description: z.string().optional(),
  flower_description: z.string().optional(),
  fruit_seed_description: z.string().optional(),
});

// 13. Safety and Risks
export const safetySchema = z.object({
  toxicity: z.string().optional(),
  contraindications: z.string().optional(),
  pregnancy_lactation: z.string().optional(),
  drug_interactions: z.string().optional(),
  side_effects: z.string().optional(),
  notes: z.string().optional(),
});

// 14. Plants (Main Table)
export const plantSchema = z.object({
  scientific_name: z.string().min(1, "Scientific name is required"),
  family_name: z.string().optional(), // Just a string reference or ID
  genus: z.string().optional(),
  species: z.string().optional(),
  botanical_synonyms: optionalStringArray,
  common_names: optionalStringArray,
  plant_type: z.string().optional(),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  images: optionalStringArray, // Array of URLs
  tags: optionalStringArray,
  // Relations (stored as IDs)
  family: z.string().min(1, "Family is required"),
  origin: z.string().optional(),
  habitat: z.string().optional(),
  ayurveda: z.string().optional(),
  chemical_profile: z.string().optional(),
  medicinal_profile: z.string().optional(),
  propagation: z.string().optional(),
  cultivation: z.string().optional(),
  morphology: z.string().optional(),
  risks: z.string().optional(),
});

// 15. Plant Varieties
export const plantVarietySchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  rank: z.string().optional(), // 'subspecies', 'variety', 'cultivar'
  scientific_name: z.string().min(1, "Scientific name is required"),
  common_name: z.string().optional(),
  morphological_notes: z.string().optional(),
  usage_notes: z.string().optional(),
});

// 16. Plant Medicinal Actions
export const plantMedicinalActionSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  action_term: z.string().min(1, "Action term is required"),
  action_system: z.string().optional(),
  target_system: z.string().optional(),
  evidence_level: z.string().optional(),
  notes: z.string().optional(),
});

// 17. Plant Part Usage
export const plantPartUsageSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  plant_part: z.string().min(1, "Plant part ID is required"),
  preparation_form: z.string().optional(),
  route: z.string().optional(),
  indication: z.string().min(1, "Indication is required"),
  notes: z.string().optional(),
});

// 18. Plant Chemical Map
export const plantChemicalMapSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  chemical: z.string().min(1, "Chemical ID is required"),
  plant_part: z.string().optional(),
  concentration_min: z.coerce.number().optional(),
  concentration_max: z.coerce.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

// 19. Plant Tags
export const plantTagSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  tag: z.string().min(1, "Tag ID is required"),
});

// 20. References
export const referenceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().optional(),
  year: z.coerce.number().optional(),
  journal_or_book: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  reference_type: z.string().optional(),
  notes: z.string().optional(),
});

// 21. Plant References
export const plantReferenceSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  reference: z.string().min(1, "Reference ID is required"),
  relation_type: z.string().optional(),
});

// 24. Images (Note: jumping to 24 per user requirement)
export const imageSchema = z.object({
  plant: z.string().min(1, "Plant ID is required"),
  plant_variety: z.string().optional(),
  url: z.string().url("Valid URL is required"),
  caption: z.string().optional(),
  photographer: z.string().optional(),
  license: z.string().optional(),
  source: z.string().optional(),
  shot_part: z.string().optional(),
});

export const schemas = {
  families: familySchema,
  plant_parts: plantPartSchema,
  tags: tagSchema,
  chemical_constituents: chemicalConstituentSchema,
  origins: originSchema,
  habitats: habitatSchema,
  ayurvedic_properties: ayurvedicPropertiesSchema,
  chemical_profiles: chemicalProfileSchema,
  medicinal_profiles: medicinalProfileSchema,
  propagation_methods: propagationMethodSchema,
  cultivation_requirements: cultivationRequirementSchema,
  plant_morphology: plantMorphologySchema,
  safety_and_risks: safetySchema,
  plants: plantSchema,
  plant_varieties: plantVarietySchema,
  plant_medicinal_actions: plantMedicinalActionSchema,
  plant_part_usage: plantPartUsageSchema,
  plant_chemical_map: plantChemicalMapSchema,
  plant_tags: plantTagSchema,
  references: referenceSchema,
  plant_references: plantReferenceSchema,
  images: imageSchema,
};
