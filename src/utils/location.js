import { DEPARTEMENTS_ILE_DE_FRANCE } from "../constants/location";

export async function determinerLocalisation(ville, pays) {
  if (pays === "France") {
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${ville}&fields=nom,codeDepartement`
      );
      const data = await response.json();
      if (data.length > 0) {
        const villeExacte = data.find(
          (commune) => commune.nom.toLowerCase() === ville.toLowerCase()
        );

        let departementCode = villeExacte
          ? villeExacte.codeDepartement
          : data[0].codeDepartement;

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
  return pays;
}
