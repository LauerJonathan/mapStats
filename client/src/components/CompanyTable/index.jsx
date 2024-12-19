import React, { useState } from "react";
import { EditCompanyModal } from "../EditCompanyModal";

import { useDispatch } from "react-redux"; // Importer useDispatch et useSelector
import { updateCompany } from "../../redux/features/companiesSlice"; // Importer l'action addCompany
import { ETATS_ENTREPRISE, COUNTRY_CODE } from "../../constants/global";
export function CompanyTable({
  companies,
  isInternational,
  modifierEntreprise,
}) {
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentCountry, setCurrentCountry] = useState(null);

  const handleEdit = (company, index) => {
    setEditingCompany(company);
    setEditingIndex(index);
  };

  const handleSave = async (modifiedCompany) => {
    try {
      await modifierEntreprise(editingIndex, modifiedCompany);
      setEditingCompany(null);
      setEditingIndex(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatePriority = (state) => {
    switch (state) {
      case ETATS_ENTREPRISE.ENTRETIEN:
        return 1;
      case ETATS_ENTREPRISE.EN_ATTENTE:
        return 2;
      case ETATS_ENTREPRISE.REFUS:
        return 3;
      default:
        return 4;
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    return getStatePriority(a.etat) - getStatePriority(b.etat);
  });

  const dispatch = useDispatch();

  const changeCompanyState = (e) => {
    const { name, id } = e.target;
    try {
      dispatch(updateCompany({ id, company: { etat: name } }));
    } catch {
      console.error("Une erreur lors du chgt");
    }
  };

  return (
    <>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Nom</th>
            <th className="border p-2 text-left">Ville</th>
            <th className="border p-2 text-left">Poste</th>
            <th className="border p-2 text-left">État</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCompanies.map((entreprise, index) => {
            return (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  entreprise.etat === ETATS_ENTREPRISE.ENTRETIEN
                    ? "bg-green"
                    : entreprise.etat === ETATS_ENTREPRISE.REFUS
                    ? "bg-red"
                    : ""
                }`}>
                <td className="border p-2">{entreprise.nom}</td>
                <td className="border p-2">
                  <strong>{entreprise.ville}</strong>
                  {!isInternational
                    ? ` (${entreprise.departement})`
                    : ` (${COUNTRY_CODE[entreprise.pays]})`}
                </td>
                <td className="border p-2">{entreprise.poste}</td>
                <td className="border p-2">{entreprise.etat}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entreprise, index)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Modifier">
                      ✏️
                    </button>
                    {entreprise.etat !== ETATS_ENTREPRISE.ENTRETIEN && (
                      <button
                        onClick={changeCompanyState}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Marquer comme entretien"
                        name="entretien"
                        id={entreprise._id}>
                        📅
                      </button>
                    )}
                    {entreprise.etat !== ETATS_ENTREPRISE.REFUS && (
                      <button
                        onClick={changeCompanyState}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Marquer comme refusé"
                        name="refus"
                        id={entreprise._id}>
                        ❌
                      </button>
                    )}
                    {entreprise.etat !== ETATS_ENTREPRISE.EN_ATTENTE && (
                      <button
                        onClick={changeCompanyState}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Remettre en attente"
                        name="en attente"
                        id={entreprise._id}>
                        ⏳
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          isOpen={!!editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleSave}
          isInternational={isInternational}
        />
      )}
    </>
  );
}
