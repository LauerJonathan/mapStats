import React, { useState } from "react";

export function AddCompanyForm({ onAddCompany }) {
  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    ville: "",
    departement: "",
    pays: "France",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddCompany(formData);
    if (success) {
      setFormData({
        nom: "",
        poste: "",
        ville: "",
        departement: "",
        pays: "France",
      });
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
    </form>
  );
}
