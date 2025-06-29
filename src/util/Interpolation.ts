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

export function computeValueByCenter({
  min,
  max,
  initialCenter,
  initialValue,
  newCenter,
}: {
  min: number;
  max: number;
  initialCenter: number;
  initialValue: number;
  newCenter: number;
}): number {
  // 1) longueurs autour de l'ancien centre
  const left0 = initialCenter - min;
  const right0 = max - initialCenter;
  const longest0 = Math.max(left0, right0);

  // plage dégénérée
  if (longest0 === 0) return newCenter;

  // 2) signe + proportion r
  const sign = Math.sign(initialValue - initialCenter);
  const r = Math.abs(initialValue - initialCenter) / longest0;

  // 3) longueurs autour du nouveau centre
  const left1 = newCenter - min;
  const right1 = max - newCenter;
  const longest1 = Math.max(left1, right1);

  // 4) on remet le signe d'origine
  const offset = r * longest1;
  const newValue = newCenter + sign * offset;

  // 5) clamp
  return Math.min(Math.max(newValue, min), max);
}


/**
 * Calcule la hue de colorD en appliquant à hueC
 * le décalage de hue entre hueA et hueB.
 *
 * @param hueA - hue de la couleur A (en degrés, 0–360)
 * @param hueB - hue de la couleur B (en degrés, 0–360)
 * @param hueC - hue de la couleur C (en degrés, 0–360)
 * @returns hue de la couleur D (en degrés, 0–360)
 */
export function interpolateHueRelative({
  initialCenter,
  initialValue,
  newCenter,
}: {
  initialCenter: number;
  initialValue: number;
  newCenter: number;
}): number {
  // 1. Calcul du décalage brut
  const delta = initialValue - initialCenter;

  // 2. Application du décalage à hueC
  let newValue = newCenter + delta;

  // 3. Remise dans l’intervalle [0, 360[
  newValue = ((newValue % 360) + 360) % 360;

  return newValue;
}
