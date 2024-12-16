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
    setEntreprises((prev) => [...prev, entreprise]);
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
        supprimerToutesEntreprises,
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
  });
  const { entreprises, ajouterEntreprise, supprimerToutesEntreprises } =
    useEntreprises();

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Détecter le département via une API (exemple : GeoAPI Gouv)
  const detecterDepartement = async (ville) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const departement = await detecterDepartement(formData.ville);

    if (departement) {
      const departements = Array.isArray(departement)
        ? departement
        : [departement];

      const nouvelleEntreprise = {
        nom: formData.nom,
        poste: formData.poste,
        ville: formData.ville,
        departement: departements[0], // Garder le premier département pour l'affichage
      };

      ajouterEntreprise(nouvelleEntreprise);

      // Réinitialiser le formulaire
      setFormData({ nom: "", poste: "", ville: "", departement: "" });
    } else {
      alert("Impossible de détecter le département pour cette ville.");
    }
  };

  // Calcul du nombre d'entreprises par département
  const entreprisesParDepartement = entreprises.reduce((acc, entreprise) => {
    acc[entreprise.departement] = (acc[entreprise.departement] || 0) + 1;
    return acc;
  }, {});

  // Obtenir les départements uniques avec gestion spéciale pour l'Île-de-France
  const departementsPourCarte = [
    ...new Set(
      Object.keys(entreprisesParDepartement).flatMap((dept) =>
        ["75", "92", "93", "94"].includes(dept)
          ? DEPARTEMENTS_ILE_DE_FRANCE
          : [dept]
      )
    ),
  ];

  return (
    <div className="App">
      <section>
        <h1>Ma carte interactive</h1>
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

          <button type="submit">Ajouter</button>
          <button type="button" onClick={supprimerToutesEntreprises}>
            Supprimer toutes les entreprises
          </button>
        </form>

        <h2>Entreprises enregistrées</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>Poste</th>
              <th>Département</th>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((entreprise, index) => (
              <tr key={index}>
                <td>{entreprise.nom}</td>
                <td>{entreprise.ville}</td>
                <td>{entreprise.poste}</td>
                <td>
                  {entreprise.departement +
                    " (" +
                    entreprisesParDepartement[entreprise.departement] +
                    ")"}
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
