import React from 'react';

export function CompanyTable({ 
  companies, 
  isInternational = false, 
  entreprisesParLocalisation,
  ETATS_ENTREPRISE,
  changerEtatEntreprise 
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Ville</th>
          {isInternational ? <th>Pays</th> : <th>Département</th>}
          <th>Poste</th>
          <th>État</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((entreprise, index) => (
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
            {isInternational ? (
              <td>{entreprise.pays}</td>
            ) : (
              <td>
                {entreprise.departement +
                  " (" +
                  (entreprisesParLocalisation[entreprise.departement] || 0) +
                  ")"}
              </td>
            )}
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
  );
}