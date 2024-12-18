import React from "react";
import France from "@socialgouv/react-departements";
import {
  EntreprisesProvider,
  useEntreprises,
} from "./contexts/EntrepriseContext";
import { AddCompanyForm } from "./components/AddCompanyForm";
import { CompanyTable } from "./components/CompanyTable";
import { determinerLocalisation } from "./utils/location";
import { DEPARTEMENTS_ILE_DE_FRANCE } from "./constants/location";

function App() {
  const {
    entreprises,
    ajouterEntreprise,
    changerEtatEntreprise,
    ETATS_ENTREPRISE,
  } = useEntreprises();

  const handleAddCompany = async (formData) => {
    const localisation = await determinerLocalisation(
      formData.ville,
      formData.pays
    );

    if (localisation) {
      const localisations = Array.isArray(localisation)
        ? localisation
        : [localisation];

      const nouvelleEntreprise = {
        ...formData,
        departement: localisations[0],
      };

      ajouterEntreprise(nouvelleEntreprise);
      return true;
    } else {
      alert("Impossible de détecter la localisation pour cette ville.");
      return false;
    }
  };

  const entreprisesParLocalisation = entreprises.reduce((acc, entreprise) => {
    const key =
      entreprise.pays === "France" ? entreprise.departement : entreprise.pays;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const departementsPourCarte = [
    ...new Set(
      Object.keys(entreprisesParLocalisation)
        .filter((key) =>
          entreprises.some(
            (e) =>
              e.pays === "France" &&
              (e.departement === key ||
                (["75", "92", "93", "94"].includes(key) &&
                  DEPARTEMENTS_ILE_DE_FRANCE.includes(e.departement)))
          )
        )
        .flatMap((dept) =>
          ["75", "92", "93", "94"].includes(dept)
            ? DEPARTEMENTS_ILE_DE_FRANCE
            : [dept]
        )
    ),
  ];

  const entreprisesFrancaises = entreprises.filter((e) => e.pays === "France");
  const entreprisesInternationales = entreprises.filter(
    (e) => e.pays !== "France"
  );

  return (
    <div className="App">
      <section>
        <h1>Recherche d'emploi</h1>
        <France departements={departementsPourCarte} selectedColor="#007bff" />
      </section>

      <section>
        <AddCompanyForm onAddCompany={handleAddCompany} />

        <h2>Entreprises françaises</h2>
        <CompanyTable
          companies={entreprisesFrancaises}
          entreprisesParLocalisation={entreprisesParLocalisation}
          ETATS_ENTREPRISE={ETATS_ENTREPRISE}
          changerEtatEntreprise={changerEtatEntreprise}
        />

        <h2>Entreprises internationales</h2>
        <CompanyTable
          companies={entreprisesInternationales}
          isInternational={true}
          entreprisesParLocalisation={entreprisesParLocalisation}
          ETATS_ENTREPRISE={ETATS_ENTREPRISE}
          changerEtatEntreprise={changerEtatEntreprise}
        />
      </section>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <EntreprisesProvider>
      <App />
    </EntreprisesProvider>
  );
}
