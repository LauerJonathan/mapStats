import React, { createContext, useContext, useState, useEffect } from 'react';

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

  return (
    <EntreprisesContext.Provider
      value={{
        entreprises,
        ajouterEntreprise,
        changerEtatEntreprise,
        ETATS_ENTREPRISE,
      }}>
      {children}
    </EntreprisesContext.Provider>
  );
}

export function useEntreprises() {
  return useContext(EntreprisesContext);
}