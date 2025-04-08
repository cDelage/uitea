export function linearInterpolation(
  index: number,
  length: number,
  min: number,
  max: number
): number {
  if (length <= 1) return max; // Cas particulier pour un tableau d'un seul élément.

  // Normalisation de l'index dans l'intervalle [0, 1]
  const normalized = index / (length - 1);

  // Interpolation linéaire entre min et max
  return min + (max - min) * normalized;
}

export interface Point {
  x: number;
  y: number;
}
export interface Point {
  x: number;
  y: number;
}

export function linearPieceInterpolation({
  min,
  max,
  center,
  positionX,
}: {
  min: Point;
  max: Point;
  center: Point;
  positionX: number;
}): number {
  if (positionX <= center.x) {
    const t = (positionX - min.x) / (center.x - min.x);
    return min.y + t * (center.y - min.y);
  } else {
    const t = (positionX - center.x) / (max.x - center.x);
    return center.y + t * (max.y - center.y);
  }
}

/**
 * Remappe la position positionX (comprise entre 0 et 1) en fonction d'un nouveau centre.
 * L'ancien centre étant fixé à 0.5, on redimensionne la portion [0, 0.5] sur [0, newCenter]
 * et la portion [0.5, 1] sur [newCenter, 1].
 *
 * @param positionX - Une valeur entre 0 et 1.
 * @param newCenter - Une valeur entre 0 et 1 définissant le nouveau centre.
 * @returns newX - La nouvelle position remappée proportionnellement.
 */
export function mapPosition(positionX: number, newCenter: number): number {
  if (positionX < 0.5) {
    // Proportion dans l'intervalle [0, 0.5]
    const t = positionX / 0.5;
    return t * newCenter;
  } else {
    // Proportion dans l'intervalle [0.5, 1]
    const t = (positionX - 0.5) / 0.5;
    return newCenter + t * (1 - newCenter);
  }
}
