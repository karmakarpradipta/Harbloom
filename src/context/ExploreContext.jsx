import React, { createContext, useContext, useState, useEffect } from "react";
import plantService from "@/services/plantService";
import { Query } from "appwrite";

const ExploreContext = createContext();

export const useExplore = () => useContext(ExploreContext);

export const ExploreProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    families: [],
    habitats: [],
    origins: [],
    medicinalUsages: [],
    search: "",
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    families: [],
    habitats: [],
    origins: [],
    medicinalUsages: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch Filter Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [familiesRes, habitatsRes, originsRes, medicinalRes] = await Promise.all([
          plantService.getFamilies([Query.limit(100), Query.orderAsc("name")]),
          plantService.getHabitats([Query.limit(100)]),
          plantService.getOrigins([Query.limit(100), Query.orderAsc("name")]),
          plantService.getMedicinalProfiles([Query.limit(100)]),
        ]);

        // Process Medicinal Profiles to extract unique "Systems" or "Actions" as usages
        // Assuming medicinalRes.documents contains profiles with a 'systems' array or 'actions' array
        // We'll aggregate unique systems for now as "Medicinal Usage"
        const uniqueDirectUsages = new Set();
        (medicinalRes?.documents || []).forEach(doc => {
            if (doc.systems && Array.isArray(doc.systems)) {
                doc.systems.forEach(sys => uniqueDirectUsages.add(sys));
            }
             // Optional: Add Actions too if requested
             // if (doc.actions && Array.isArray(doc.actions)) {
             //   doc.actions.forEach(action => uniqueDirectUsages.add(action));
             // }
        });


        setFilters({
          families: familiesRes?.documents || [],
          habitats: habitatsRes?.documents || [],
          origins: originsRes?.documents || [],
          medicinalUsages: Array.from(uniqueDirectUsages).sort(),
          search: "",
        });
      } catch (error) {
        console.error("Failed to fetch explore filters", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const toggleFamily = (familyId) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.families.includes(familyId);
      return {
        ...prev,
        families: isSelected
          ? prev.families.filter((id) => id !== familyId)
          : [...prev.families, familyId],
      };
    });
  };

  const toggleHabitat = (habitatId) => {
      setSelectedFilters((prev) => {
        const isSelected = prev.habitats.includes(habitatId);
        return {
          ...prev,
          habitats: isSelected
            ? prev.habitats.filter((id) => id !== habitatId)
            : [...prev.habitats, habitatId],
      };
    });
  };

  const toggleOrigin = (originId) => {
      setSelectedFilters((prev) => {
        const isSelected = prev.origins.includes(originId);
        return {
          ...prev,
          origins: isSelected
            ? prev.origins.filter((id) => id !== originId)
            : [...prev.origins, originId],
      };
    });
  };

  const toggleMedicinalUsage = (usage) => {
      setSelectedFilters((prev) => {
        const isSelected = prev.medicinalUsages.includes(usage);
        return {
          ...prev,
          medicinalUsages: isSelected
            ? prev.medicinalUsages.filter((u) => u !== usage)
            : [...prev.medicinalUsages, usage],
      };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({ families: [], habitats: [], origins: [], medicinalUsages: [] });
  };

  return (
    <ExploreContext.Provider
      value={{
        filters,
        selectedFilters,
        toggleFamily,
        toggleHabitat,
        toggleOrigin,
        toggleMedicinalUsage,
        resetFilters,
        loading,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
