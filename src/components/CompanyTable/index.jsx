import React, { useState } from "react";
import { EditCompanyModal } from "../EditCompanyModal";

export function CompanyTable({
  companies,
  isInternational,
  entreprisesParLocalisation,
  ETATS_ENTREPRISE,
  changerEtatEntreprise,
  modifierEntreprise,
}) {
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

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

  return (
    <>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Nom</th>
            <th className="border p-2 text-left">Ville</th>
            {isInternational ? (
              <th className="border p-2 text-left">Pays</th>
            ) : (
              <th className="border p-2 text-left">Département</th>
            )}
            <th className="border p-2 text-left">Poste</th>
            <th className="border p-2 text-left">État</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((entreprise, index) => (
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
              <td className="border p-2">{entreprise.ville}</td>
              {isInternational ? (
                <td className="border p-2">{entreprise.pays}</td>
              ) : (
                <td className="border p-2">
                  {entreprise.departement} (
                  {entreprisesParLocalisation[entreprise.departement] || 0})
                </td>
              )}
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
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.ENTRETIEN)
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Marquer comme entretien">
                      📅
                    </button>
                  )}
                  {entreprise.etat !== ETATS_ENTREPRISE.REFUS && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(index, ETATS_ENTREPRISE.REFUS)
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Marquer comme refusé">
                      ❌
                    </button>
                  )}
                  {entreprise.etat !== ETATS_ENTREPRISE.EN_ATTENTE && (
                    <button
                      onClick={() =>
                        changerEtatEntreprise(
                          index,
                          ETATS_ENTREPRISE.EN_ATTENTE
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Remettre en attente">
                      ⏳
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
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
