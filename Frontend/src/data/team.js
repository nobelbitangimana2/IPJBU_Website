/**
 * Données de l'équipe — récupérées depuis l'API backend.
 * Ces helpers restent pour rétrocompatibilité éventuelle.
 * L'équipe est gérée via le panneau d'administration.
 */

export async function getTeamMembers() {
  // Les membres de l'équipe sont chargés via DataContext (API backend)
  return Promise.resolve([])
}
