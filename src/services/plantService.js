import conf from "@/conf/conf";
import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

export class PlantService {
  // Helper for safe creation with retries
  async createDocumentSafe(collectionId, data, id = ID.unique()) {
    const maxRetries = 3;
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        // Use provided ID for first attempt if it wasn't strictly unique, 
        // but typically we pass ID.unique() which is generated *before* call.
        // Better approach: Generate NEW ID on retry.
        const docId = attempts === 0 ? id : ID.unique();
        
        return await databases.createDocument(
            conf.appwriteDatabaseId,
            collectionId,
            docId,
            data
        );
      } catch (error) {
        if (error.code === 409 && attempts < maxRetries - 1) {
             console.warn(`Appwrite service :: createDocumentSafe :: ID collision on ${collectionId}, retrying... (Attempt ${attempts + 1})`);
             attempts++;
             continue;
        }
        throw error;
      }
    }
  }

  async createPlant(plantData) {
    try {
      return await this.createDocumentSafe(conf.appwriteCollectionIdPlants, plantData);
    } catch (error) {
       console.error("Appwrite service :: createPlant :: error", error);
       throw error;
    }
  }

  async createImageRecord(data) {
    try {
      return await this.createDocumentSafe(conf.appwriteCollectionIdImages, data);
    } catch (error) {
      console.error("Appwrite service :: createImageRecord :: error", error);
      throw error;
    }
  }

  async createPlantPartUsage(data) {
    try {
       return await this.createDocumentSafe(conf.appwriteCollectionIdPlantPartUsage, data);
    } catch (error) {
      console.error("Appwrite service :: createPlantPartUsage :: error", error);
      throw error;
    }
  }

  async updatePlant(id, plantData) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlants,
        id,
        plantData
      );
    } catch (error) {
      console.error("Appwrite service :: updatePlant :: error", error);
      throw error;
    }
  }

  async getPlants(queries = [Query.limit(100), Query.orderDesc("$createdAt")]) {
    try {
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlants,
        queries
      );
    } catch (error) {
      console.error("Appwrite service :: getPlants :: error", error);
      return false;
    }
  }

  async getPlant(id) {
    try {
      return await databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlants,
        id
      );
    } catch (error) {
      console.error("Appwrite service :: getPlant :: error", error);
      return false;
    }
  }

  async deletePlant(id) {
    try {
      // 1. Fetch Plant to get related images
      const plant = await this.getPlant(id);
      if (plant && plant.images && plant.images.length > 0) {
        // 2. Delete all associated images
        const imagePromises = plant.images.map(async (img) => {
          // If img is object (expanded)
          if (typeof img === "object" && img.$id && img.url) {
            return this.deleteImageRecord(img.$id, img.url);
          }
          // If img is ID string
          if (typeof img === "string") {
            const imageDoc = await databases.getDocument(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionIdImages,
              img
            );
            if (imageDoc) {
              return this.deleteImageRecord(imageDoc.$id, imageDoc.url);
            }
          }
        });
        await Promise.all(imagePromises);
      }

      // 3. Delete the Plant Document
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlants,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePlant :: error", error);
      return false;
    }
  }

  async deleteImageRecord(id, url) {
    try {
      // 1. Delete from Appwrite Database
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdImages,
        id
      );

      // 2. Delete from Uploadcare Storage (if URL is provided)
      if (url) {
        const { extractUuidFromUrl, deleteFileFromUploadcare } = await import(
          "@/lib/uploadcare"
        );
        const uuid = extractUuidFromUrl(url);
        if (uuid) {
          await deleteFileFromUploadcare(uuid);
        }
      }

      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteImageRecord :: error", error);
      return false;
    }
  }

  async getPlantImages(plantId) {
    try {
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdImages,
        [
          Query.equal("plants", plantId),
          Query.limit(10), // Increased from 1 to allow multiple images for gallery/parts
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: getPlantImages :: error", error);
      return { documents: [] };
    }
  }

  // --- USERS ---
  async getTags(queries = [Query.limit(100)]) {
    try {
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdTags,
        queries
      );
    } catch (error) {
      console.error("Appwrite service :: getTags :: error", error);
      return false;
    }
  }

  async getUsers(queries = [Query.limit(100)]) {
    try {
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdUsers,
        queries
      );
    } catch (error) {
      console.error("Appwrite service :: getUsers :: error", error);
      return false;
    }
  }

  // --- FAMILIES ---
  async getFamilies() {
    try {
      if (!conf.appwriteCollectionIdFamilies) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdFamilies,
        [Query.limit(100), Query.orderAsc("name")]
      );
    } catch (error) {
      console.error("Appwrite service :: getFamilies :: error", error);
      return { documents: [] };
    }
  }

  async updateFamily(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdFamilies,
        id,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: updateFamily :: error", error);
      throw error;
    }
  }

  async deleteFamily(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdFamilies,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFamily :: error", error);
      return false;
    }
  }

  // --- ORIGINS ---
  async createOrigin(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdOrigins,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: createOrigin :: error", error);
      throw error;
    }
  }

  async getOrigins() {
    try {
      if (!conf.appwriteCollectionIdOrigins) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdOrigins,
        [Query.limit(100), Query.orderAsc("region")]
      );
    } catch (error) {
      console.error("Appwrite :: getOrigins :: error", error);
      return { documents: [] };
    }
  }

  async updateOrigin(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdOrigins,
        id,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: updateOrigin :: error", error);
      throw error;
    }
  }

  async deleteOrigin(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdOrigins,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteOrigin :: error", error);
      return false;
    }
  }

  // --- HABITATS ---
  async createHabitat(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdHabitats,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: createHabitat :: error", error);
      throw error;
    }
  }

  async getHabitats() {
    try {
      if (!conf.appwriteCollectionIdHabitats) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdHabitats,
        [Query.limit(100), Query.orderAsc("climate")]
      );
    } catch (error) {
      console.error("Appwrite :: getHabitats :: error", error);
      return { documents: [] };
    }
  }

  async updateHabitat(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdHabitats,
        id,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: updateHabitat :: error", error);
      throw error;
    }
  }

  async deleteHabitat(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdHabitats,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteHabitat :: error", error);
      return false;
    }
  }

  // --- CHEMICAL PROFILES ---
  async createChemicalProfile(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdChemicalProfiles,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createChemicalProfile :: error",
        error
      );
      throw error;
    }
  }

  async getChemicalProfiles() {
    try {
      if (!conf.appwriteCollectionIdChemicalProfiles) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdChemicalProfiles,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Appwrite service :: getChemicalProfiles :: error", error);
      return { documents: [] };
    }
  }

  async deleteChemicalProfile(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdChemicalProfiles,
        id
      );
      return true;
    } catch (error) {
      console.error(
        "Appwrite service :: deleteChemicalProfile :: error",
        error
      );
      return false;
    }
  }

  // --- MEDICINAL PROFILES ---
  async createMedicinalProfile(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdMedicinalProfiles,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createMedicinalProfile :: error",
        error
      );
      throw error;
    }
  }

  async getMedicinalProfiles() {
    try {
      if (!conf.appwriteCollectionIdMedicinalProfiles) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdMedicinalProfiles,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Appwrite service :: getMedicinalProfiles :: error", error);
      return { documents: [] };
    }
  }

  async deleteMedicinalProfile(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdMedicinalProfiles,
        id
      );
      return true;
    } catch (error) {
      console.error(
        "Appwrite service :: deleteMedicinalProfile :: error",
        error
      );
      return false;
    }
  }

  // --- AYURVEDIC PROPERTIES ---
  async createAyurvedicProperty(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdAyurvedicProperties,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createAyurvedicProperty :: error",
        error
      );
      throw error;
    }
  }

  async getAyurvedicProperties() {
    try {
      if (!conf.appwriteCollectionIdAyurvedicProperties)
        return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdAyurvedicProperties,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error(
        "Appwrite service :: getAyurvedicProperties :: error",
        error
      );
      return { documents: [] };
    }
  }

  async updateAyurvedicProperty(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdAyurvedicProperties,
        id,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: updateAyurvedicProperty :: error",
        error
      );
      throw error;
    }
  }

  async deleteAyurvedicProperty(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdAyurvedicProperties,
        id
      );
      return true;
    } catch (error) {
      console.error(
        "Appwrite service :: deleteAyurvedicProperty :: error",
        error
      );
      return false;
    }
  }

  // --- CULTIVATION PROFILES ---
  async createCultivationProfile(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdCultivationRequirements,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createCultivationProfile :: error",
        error
      );
      throw error;
    }
  }

  async getCultivationProfiles() {
    try {
      if (!conf.appwriteCollectionIdCultivationRequirements)
        return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdCultivationRequirements,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error(
        "Appwrite service :: getCultivationProfiles :: error",
        error
      );
      return { documents: [] };
    }
  }

  async deleteCultivationProfile(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdCultivationRequirements,
        id
      );
      return true;
    } catch (error) {
      console.error(
        "Appwrite service :: deleteCultivationProfile :: error",
        error
      );
      return false;
    }
  }

  // --- PLANT PARTS ---
  async createPlantPart(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdPlantParts,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: createPlantPart :: error", error);
      throw error;
    }
  }

  async getPlantParts() {
    try {
      if (!conf.appwriteCollectionIdPlantParts) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlantParts,
        [Query.limit(100), Query.orderAsc("name")]
      );
    } catch (error) {
      console.error("Appwrite service :: getPlantParts :: error", error);
      return { documents: [] };
    }
  }

  async updatePlantPart(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlantParts,
        id,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: updatePlantPart :: error", error);
      throw error;
    }
  }

  async deletePlantPart(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlantParts,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePlantPart :: error", error);
      return false;
    }
  }

  // --- PLANT PART USAGE ---


  async getPlantPartUsage(plantId) {
    try {
      if (!conf.appwriteCollectionIdPlantPartUsage) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPlantPartUsage,
        [Query.equal("plants", plantId), Query.limit(100)]
      );
    } catch (error) {
      console.error("Appwrite service :: getPlantPartUsage :: error", error);
      return { documents: [] };
    }
  }



  async getAyurvedicProperties(id) {
    try {
      if (!conf.appwriteCollectionIdAyurvedicProperties || !id) return null;
      return await databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdAyurvedicProperties,
        id
      );
    } catch (error) {
      console.error("Appwrite service :: getAyurvedicProperties :: error", error);
      return null;
    }
  }

  async getMedicinalProfile(id) {
    try {
      if (!conf.appwriteCollectionIdMedicinalProfiles || !id) return null;
      return await databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdMedicinalProfiles,
        id
      );
    } catch (error) {
      console.error("Appwrite service :: getMedicinalProfile :: error", error);
      return null;
    }
  }

  async getHabitat(id) {
    try {
      if (!conf.appwriteCollectionIdHabitats || !id) return null;
      return await databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdHabitats,
        id
      );
    } catch (error) {
      console.error("Appwrite service :: getHabitat :: error", error);
      return null;
    }
  }

  async getHabitats(queries = [Query.limit(100)]) {
      try {
        if (!conf.appwriteCollectionIdHabitats) return { documents: [] };
        return await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionIdHabitats,
          queries
        );
      } catch (error) {
        console.error("Appwrite service :: getHabitats :: error", error);
        return { documents: [] };
      }
    }

  async getOrigins(queries = [Query.limit(100)]) {
      try {
        if (!conf.appwriteCollectionIdOrigins) return { documents: [] };
        return await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionIdOrigins,
          queries
        );
      } catch (error) {
        console.error("Appwrite service :: getOrigins :: error", error);
        return { documents: [] };
      }
    }

  async getMedicinalProfiles(queries = [Query.limit(100)]) {
      try {
        if (!conf.appwriteCollectionIdMedicinalProfiles) return { documents: [] };
        return await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionIdMedicinalProfiles,
          queries
        );
      } catch (error) {
        console.error("Appwrite service :: getMedicinalProfiles :: error", error);
        return { documents: [] };
      }
    }

  // --- PROPAGATION METHODS ---
  async createPropagationMethod(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdPropagationMethods,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createPropagationMethod :: error",
        error
      );
      throw error;
    }
  }

  async getPropagationMethods() {
    try {
      if (!conf.appwriteCollectionIdPropagationMethods)
        return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPropagationMethods,
        [Query.limit(100), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error(
        "Appwrite service :: getPropagationMethods :: error",
        error
      );
      return { documents: [] };
    }
  }

  async updatePropagationMethod(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPropagationMethods,
        id,
        data
      );
    } catch (error) {
      console.error(
        "Appwrite service :: updatePropagationMethod :: error",
        error
      );
      throw error;
    }
  }

  async deletePropagationMethod(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdPropagationMethods,
        id
      );
      return true;
    } catch (error) {
      console.error(
        "Appwrite service :: deletePropagationMethod :: error",
        error
      );
      return false;
    }
  }

  // --- TAGS ---
  async createTag(data) {
    try {
      return await this.createDocumentSafe(
        conf.appwriteCollectionIdTags,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: createTag :: error", error);
      throw error;
    }
  }

  async getTags() {
    try {
      if (!conf.appwriteCollectionIdTags) return { documents: [] };
      return await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdTags,
        [Query.limit(100), Query.orderAsc("name")]
      );
    } catch (error) {
      console.error("Appwrite service :: getTags :: error", error);
      return { documents: [] };
    }
  }

  async updateTag(id, data) {
    try {
      return await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdTags,
        id,
        data
      );
    } catch (error) {
      console.error("Appwrite service :: updateTag :: error", error);
      throw error;
    }
  }

  async deleteTag(id) {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionIdTags,
        id
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteTag :: error", error);
      return false;
    }
  }

  // --- IMAGES ---

}

const plantService = new PlantService();
export default plantService;
