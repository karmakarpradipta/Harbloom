export const plantFormDefaultValues = {
  name: "",
  scientificName: "",
  shortDescription: "",
  detailedDescription: "",
  parts: [
    {
      partName: "",
      uses: [""],
      phytochemicals: [""],
      dosage: "",
      precautions: [""],
    },
  ],
  medicinalUses: [{ category: "", items: [""] }],
  preparations: [{ methodName: "", forms: [""], steps: [""] }],
  phytochemicals: [{ compoundName: "", effects: [""], concentration: "" }],
  ayurvedicProperties: {
    rasa: [""],
    guna: [""],
    virya: "",
    vipaka: "",
    doshaEffects: [""],
  },
};
