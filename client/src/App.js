import React, { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

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
