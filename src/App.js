import React, { useState, useContext, createContext, useEffect } from "react";
import France from "@socialgouv/react-departements";

const DEPARTEMENTS_ILE_DE_FRANCE = [
  "75", // Paris
  "77", // Seine-et-Marne
  "78", // Yvelines
  "91", // Essonne
  "92", // Hauts-de-Seine
  "93", // Seine-Saint-Denis
  "94", // Val-de-Marne
  "95", // Val-d'Oise
];

// États possibles pour une entreprise
const ETATS_ENTREPRISE = {
  EN_ATTENTE: "en attente",
  ENTRETIEN: "entretien",
  REFUS: "refus",
};

// Crée le contexte
const EntreprisesContext = createContext();

// Fournisseur du contexte
function EntreprisesProvider({ children }) {
  // Charger les entreprises depuis localStorage au démarrage
  const [entreprises, setEntreprises] = useState(() => {
    const savedEntreprises = localStorage.getItem("entreprises");
    return savedEntreprises ? JSON.parse(savedEntreprises) : [];
  });

  // Mettre à jour localStorage à chaque modification de la liste des entreprises
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

  // Méthode pour mettre à jour l'état d'une entreprise
  const changerEtatEntreprise = (index, nouvelEtat) => {
    setEntreprises((prev) =>
      prev.map((entreprise, i) =>
        i === index ? { ...entreprise, etat: nouvelEtat } : entreprise
      )
    );
  };

  // Ajouter une méthode pour supprimer toutes les entreprises
  const supprimerToutesEntreprises = () => {
    setEntreprises([]);
    localStorage.removeItem("entreprises");
  };

  return (
    <EntreprisesContext.Provider
      value={{
        entreprises,
        ajouterEntreprise,
        changerEtatEntreprise,
        supprimerToutesEntreprises,
        ETATS_ENTREPRISE,
      }}>
      {children}
    </EntreprisesContext.Provider>
  );
}

// Custom Hook pour accéder au contexte
function useEntreprises() {
  return useContext(EntreprisesContext);
}

// Composant principal
function App() {
  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    ville: "",
    departement: "",
    pays: "France",
  });

  const {
    entreprises,
    ajouterEntreprise,
    changerEtatEntreprise,
    supprimerToutesEntreprises,
    ETATS_ENTREPRISE,
  } = useEntreprises();

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction de détection du département ou pays
  const determinerLocalisation = async (ville, pays) => {
    if (pays === "France") {
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${ville}&fields=nom,codeDepartement`
        );
        const data = await response.json();
        if (data.length > 0) {
          // Filtrer les résultats pour trouver une correspondance exacte
          const villeExacte = data.find(
            (commune) => commune.nom.toLowerCase() === ville.toLowerCase()
          );

          let departementCode = villeExacte
            ? villeExacte.codeDepartement
            : data[0].codeDepartement;

          // Si le département est dans Paris ou petite couronne,
          // retourner tous les départements d'Île-de-France
          return ["75", "92", "93", "94"].includes(departementCode)
            ? DEPARTEMENTS_ILE_DE_FRANCE
            : departementCode;
        }
        return "";
      } catch (error) {
        console.error("Erreur lors de la détection du département :", error);
        return "";
      }
    }
    // Pour les pays étrangers, on retourne le pays
    return pays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localisation = await determinerLocalisation(
      formData.ville,
      formData.pays
    );

    if (localisation) {
      const localisations = Array.isArray(localisation)
        ? localisation
        : [localisation];

      const nouvelleEntreprise = {
        nom: formData.nom,
        poste: formData.poste,
        ville: formData.ville,
        departement: localisations[0], // Garder le premier département/pays pour l'affichage
        pays: formData.pays,
      };

      ajouterEntreprise(nouvelleEntreprise);

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        poste: "",
        ville: "",
        departement: "",
        pays: "France",
      });
    } else {
      alert("Impossible de détecter la localisation pour cette ville.");
    }
  };

  // Calcul du nombre d'entreprises par département/pays
  const entreprisesParLocalisation = entreprises.reduce((acc, entreprise) => {
    const key =
      entreprise.pays === "France" ? entreprise.departement : entreprise.pays;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Obtenir les départements uniques avec gestion spéciale pour l'Île-de-France
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

  // Séparer les entreprises françaises et internationales
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
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom de l'entreprise :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Ville :</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Poste :</label>
            <input
              type="text"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Pays :</label>
            <select
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              required>
              <option value="France">France</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Belgique">Belgique</option>
            </select>
          </div>

          <button type="submit">Ajouter</button>
          <button type="button" onClick={supprimerToutesEntreprises}>
            Supprimer toutes les entreprises
          </button>
        </form>

        <h2>Entreprises françaises</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>Poste</th>
              <th>Département</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entreprisesFrancaises.map((entreprise, index) => (
              <tr
                key={index}
                className={
                  entreprise.etat === "entretien"
                    ? "bg-green"
                    : "" + entreprise.etat === "refus"
                    ? "bg-red"
                    : ""
                }>
                <td>{entreprise.nom}</td>
                <td>{entreprise.ville}</td>
                <td>{entreprise.poste}</td>
                <td>
                  {entreprise.departement +
                    " (" +
                    (entreprisesParLocalisation[entreprise.departement] || 0) +
                    ")"}
                </td>
                <td>{entreprise.etat}</td>
                <td>
                  {entreprise.etat !== ETATS_ENTREPRISE.ENTRETIEN && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.ENTRETIEN)
                      }>
                      📅
                    </button>
                  )}
                  {entreprise.etat !== ETATS_ENTREPRISE.REFUS && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.REFUS)
                      }>
                      ❌
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Entreprises internationales</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>Pays</th>
              <th>Poste</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entreprisesInternationales.map((entreprise, index) => (
              <tr key={index}>
                <td>{entreprise.nom}</td>
                <td>{entreprise.ville}</td>
                <td>{entreprise.pays}</td>
                <td>{entreprise.poste}</td>
                <td>{entreprise.etat}</td>
                <td>
                  {entreprise.etat !== ETATS_ENTREPRISE.ENTRETIEN && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.ENTRETIEN)
                      }>
                      📅
                    </button>
                  )}
                  {entreprise.etat !== ETATS_ENTREPRISE.REFUS && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.REFUS)
                      }>
                      ❌
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// Encapsuler l'application avec le fournisseur du contexte
export default function AppWrapper() {
  return (
    <EntreprisesProvider>
      <App />
    </EntreprisesProvider>
  );
}
