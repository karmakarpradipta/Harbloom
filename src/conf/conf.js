const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionIdUsers: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_USERS
  ),

  // New Schema Collections
  appwriteCollectionIdFamilies: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_FAMILIES
  ),
  appwriteCollectionIdPlantParts: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_PARTS
  ),
  appwriteCollectionIdTags: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_TAGS
  ),
  appwriteCollectionIdChemicalConstituents: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_CHEMICAL_CONSTITUENTS
  ),
  appwriteCollectionIdOrigins: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_ORIGINS
  ),
  appwriteCollectionIdHabitats: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_HABITATS
  ),
  appwriteCollectionIdAyurvedicProperties: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_AYURVEDIC_PROPERTIES
  ),
  appwriteCollectionIdChemicalProfiles: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_CHEMICAL_PROFILES
  ),
  appwriteCollectionIdMedicinalProfiles: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_MEDICINAL_PROFILES
  ),
  appwriteCollectionIdPropagationMethods: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PROPAGATION_METHODS
  ),
  appwriteCollectionIdCultivationRequirements: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_CULTIVATION_REQUIREMENTS
  ),
  appwriteCollectionIdPlantMorphology: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_MORPHOLOGY
  ),
  appwriteCollectionIdSafetyAndRisks: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_SAFETY_AND_RISKS
  ),
  appwriteCollectionIdPlants: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANTS
  ),
  appwriteCollectionIdPlantVarieties: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_VARIETIES
  ),
  appwriteCollectionIdPlantMedicinalActions: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_MEDICINAL_ACTIONS
  ),
  appwriteCollectionIdPlantPartUsage: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_PART_USAGE
  ),
  appwriteCollectionIdPlantChemicalMap: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_CHEMICAL_MAP
  ),
  appwriteCollectionIdPlantTags: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_TAGS
  ),
  appwriteCollectionIdReferences: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_REFERENCES
  ),
  appwriteCollectionIdPlantReferences: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_PLANT_REFERENCES
  ),
  appwriteCollectionIdImages: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID_IMAGES
  ),
};

export default conf;
