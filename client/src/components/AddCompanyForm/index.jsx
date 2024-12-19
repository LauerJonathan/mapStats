import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Importer useDispatch et useSelector
import { addCompany } from "../../redux/features/companiesSlice"; // Importer l'action addCompany
import { determinerLocalisation } from "../../utils/location";

export function AddCompanyForm() {
  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    ville: "",
    departement: "",
    pays: "France",
  });

  const dispatch = useDispatch();

  // Sélectionner l'état de l'ajout de l'entreprise
  const { status, error } = useSelector((state) => state.companies);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const localisation = await determinerLocalisation(
      formData.ville,
      formData.pays
    );

    if (localisation) {
      setFormData({ ...formData, departement: localisation });
    } else {
      alert("Impossible de détecter la localisation pour cette ville.");
    }

    try {
      const action = dispatch(addCompany(formData));

      // Vérification de la réussite de l'action
      if (addCompany.fulfilled.match(action)) {
        setFormData({
          nom: "",
          poste: "",
          ville: "",
          departement: "",
          pays: "France",
        });
      } else {
        console.error("Erreur lors de l'ajout de l'entreprise");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entreprise:", error);
    }
  };

  return (
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

      {/* Affichage du status 
      {status === "loading" && <p>Enregistrement de l'entreprise...</p>}
      {status === "failed" && <p style={{ color: "red" }}>Erreur: {error}</p>}
      {status === "succeeded" && <p>Entreprise ajoutée avec succès!</p>} */}
    </form>
  );
}
