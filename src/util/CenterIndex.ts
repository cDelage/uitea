/**
 * Renvoie l'index de l'élément central d'un tableau.
 * - Si la longueur est impaire, renvoie l'index du milieu exact.
 * - Si la longueur est paire, renvoie l'index à gauche du centre.
 *
 * @param length - Longueur du tableau
 * @returns L'index central (nombre entier)
 */
export function getCenterIndex(length: number): number {
  if (length <= 0) return -1; // aucun index valide
  return Math.floor(length / 2);
}
