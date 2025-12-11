import React, { createContext, useContext, useState, useEffect } from "react";
import plantService from "@/services/plantService";
import { Query } from "appwrite";

const ExploreContext = createContext();

export const useExplore = () => useContext(ExploreContext);

export const ExploreProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    families: [],
    habitats: [],
    search: "",
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    families: [],
    habitats: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch Filter Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [familiesRes, habitatsRes] = await Promise.all([
          plantService.getFamilies([Query.limit(100), Query.orderAsc("name")]),
          plantService.getHabitats([Query.limit(100)]),
        ]);

        setFilters({
          families: familiesRes?.documents || [],
          habitats: habitatsRes?.documents || [],
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

  const resetFilters = () => {
    setSelectedFilters({ families: [], habitats: [] });
  };

  return (
    <ExploreContext.Provider
      value={{
        filters,
        selectedFilters,
        toggleFamily,
        toggleHabitat,
        resetFilters,
        loading,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
