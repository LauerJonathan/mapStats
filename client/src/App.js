import React, { useEffect, useState } from "react";
import France from "@socialgouv/react-departements";
import { AddCompanyForm } from "./components/AddCompanyForm";
import { CompanyTable } from "./components/CompanyTable";

// import CONST
import {
  DEPARTEMENTS_ILE_DE_FRANCE,
  ETATS_ENTREPRISE,
} from "./constants/global";

// State manager
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "./redux/features/companiesSlice";

function App() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.companies);
  const entreprises = items;

  const [candidature, setCandidature] = useState({
    EN_ATTENTE: 0,
    ENTRETIEN: 0,
    REFUS: 0,
  });

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    // Recalculer les compteurs chaque fois que entreprises change
    const newCandidature = {
      EN_ATTENTE: 0,
      ENTRETIEN: 0,
      REFUS: 0,
    };

    entreprises.forEach((entreprise) => {
      if (entreprise.etat === "en attente") {
        newCandidature.EN_ATTENTE++;
      } else if (entreprise.etat === "entretien") {
        newCandidature.ENTRETIEN++;
      } else if (entreprise.etat === "refus") {
        newCandidature.REFUS++;
      }
    });

    setCandidature(newCandidature);
  }, [entreprises]);

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
        <div>
          <p>⏳ En attente : {candidature.EN_ATTENTE}</p>
          <p>📆 Entretien : {candidature.ENTRETIEN}</p>
          <p>❌ Refus : {candidature.REFUS}</p>
        </div>
        <France departements={departementsPourCarte} selectedColor="#007bff" />
      </section>
      <section>
        <AddCompanyForm />

        <h2>Entreprises françaises</h2>
        <CompanyTable
          companies={entreprisesFrancaises}
          entreprisesParLocalisation={entreprisesParLocalisation}
          ETATS_ENTREPRISE={ETATS_ENTREPRISE}
        />

        <h2>Entreprises internationales</h2>
        <CompanyTable
          companies={entreprisesInternationales}
          isInternational={true}
          entreprisesParLocalisation={entreprisesParLocalisation}
          ETATS_ENTREPRISE={ETATS_ENTREPRISE}
        />
      </section>
    </div>
  );
}

export default function AppWrapper() {
  return <App />;
}
