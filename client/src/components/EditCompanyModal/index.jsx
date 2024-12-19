import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // Importer useDispatch et useSelector
import {
  updateCompany,
  deleteCompany,
} from "../../redux/features/companiesSlice"; // Importer l'action addCompany

export function EditCompanyModal({
  company,
  isOpen,
  onClose,
  onSave,
  isInternational,
}) {
  const [formData, setFormData] = useState(company);

  useEffect(() => {
    setFormData(company);
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(company._id);
    try {
      dispatch(updateCompany({ id: company._id, company: formData }));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = () => {
    try {
      dispatch(deleteCompany(company._id));
    } catch {
      console.error("Une erreur lors de la suppression");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Modifier l'entreprise</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nom de l'entreprise</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Ville</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Poste</label>
            <input
              type="text"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {isInternational && (
            <div className="mb-4">
              <label className="block mb-1">Pays</label>
              <select
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Belgique">Belgique</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Annuler
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={deleteItem}>
              Supprimer
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
