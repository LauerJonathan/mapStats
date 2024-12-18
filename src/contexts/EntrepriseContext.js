import React, { createContext, useContext, useState, useEffect } from "react";
import { determinerLocalisation } from "../utils/location";
import { companyList } from "./data";

const ETATS_ENTREPRISE = {
  EN_ATTENTE: "en attente",
  ENTRETIEN: "entretien",
  REFUS: "refus",
};

const EntreprisesContext = createContext();

export function EntreprisesProvider({ children }) {
  const [entreprises, setEntreprises] = useState(() => {
    const savedEntreprises = localStorage.getItem("entreprises");
    return savedEntreprises ? JSON.parse(savedEntreprises) : [];
  });

  useEffect(() => {
    localStorage.setItem("entreprises", JSON.stringify(entreprises));
  }, [entreprises]);

  const ajouterEntreprise = (entreprise) => {
    const entrepriseAvecEtat = {
      ...entreprise,
      etat: ETATS_ENTREPRISE.EN_ATTENTE,
    };
    setEntreprises((prev) => [...prev, entrepriseAvecEtat]);
  };

  const changerEtatEntreprise = (index, nouvelEtat) => {
    setEntreprises((prev) =>
      prev.map((entreprise, i) =>
        i === index ? { ...entreprise, etat: nouvelEtat } : entreprise
      )
    );
  };

  const modifierEntreprise = async (index, entrepriseModifiee) => {
    try {
      if (entrepriseModifiee.pays === "France") {
        const localisation = await determinerLocalisation(
          entrepriseModifiee.ville,
          entrepriseModifiee.pays
        );

        if (localisation) {
          const localisations = Array.isArray(localisation)
            ? localisation
            : [localisation];

          entrepriseModifiee.departement = localisations[0];
        } else {
          throw new Error(
            "Impossible de détecter la localisation pour cette ville."
          );
        }
      }

      setEntreprises((prev) =>
        prev.map((entreprise, i) =>
          i === index ? { ...entreprise, ...entrepriseModifiee } : entreprise
        )
      );
    } catch (error) {
      throw error;
    }
  };

  const supprimerToutesEntreprises = () => {
    setEntreprises([]);
    localStorage.removeItem("entreprises");
  };

  const value = {
    entreprises,
    ajouterEntreprise,
    changerEtatEntreprise,
    modifierEntreprise,
    supprimerToutesEntreprises,
    ETATS_ENTREPRISE,
  };

  return (
    <EntreprisesContext.Provider value={value}>
      {children}
    </EntreprisesContext.Provider>
  );
}

export const useEntreprises = () => useContext(EntreprisesContext);
