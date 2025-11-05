export function linearInterpolation(
  index: number,
  length: number,
  min: number,
  max: number,
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

export function midpoint(a: number, b: number): number {
  // Utilise "a + (b - a) / 2" pour éviter un éventuel dépassement avec (a + b) / 2
  return a + (b - a) / 2;
}

type RangeMapParams = {
  min: number;
  max: number;
  value: number;
  newMin: number;
  newMax: number;
};

type RangeMapOptions = {
  /** Force la valeur dans [0,1] avant re-mapping */
  clamp?: boolean;
  /** Arrondi à n décimales (si défini) */
  decimals?: number;
};

/**
 * Re-map linéaire de value depuis [min,max] vers [newMin,newMax].
 */
export function mapRange(
  { min, max, value, newMin, newMax }: RangeMapParams,
  { clamp = false, decimals }: RangeMapOptions = {},
): number {
  if (!Number.isFinite(min + max + value + newMin + newMax)) {
    throw new Error('Tous les paramètres doivent être des nombres finis.');
  }
  if (min === max) {
    // Intervalle source nul : on renvoie le milieu de la nouvelle plage
    return (newMin + newMax) / 2;
  }

  // Normalisation dans [0,1] (fonctionne aussi si min > max)
  let t = (value - min) / (max - min);
  if (clamp) t = Math.max(0, Math.min(1, t));

  const mapped = newMin + t * (newMax - newMin);

  if (typeof decimals === 'number') {
    const p = Math.pow(10, decimals);
    return Math.round(mapped * p) / p;
  }
  return mapped;
}

/**
 * Interpole une valeur entre 0 et 1 à partir d'un index.
 * - value(centerIndex) = 0
 * - value(endIndex)    = 1
 * - linéaire entre les deux
 * - clampée à 0 avant le center et à 1 après la fin
 * Gère aussi le cas endIndex < centerIndex.
 */
export function interpolateBetweenIndices({
  centerIndex,
  index,
  endIndex,
}: {
  index: number;
  centerIndex: number;
  endIndex: number;
}): number {
  if (centerIndex === endIndex) {
    // Dégénéré : tout ce qui est du côté "end" vaut 1, l'autre côté 0.
    return index >= endIndex ? 1 : 0;
  }

  const t = (index - centerIndex) / (endIndex - centerIndex);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t; // linéaire dans (0,1)
}

/**
 * Pondération linéaire centrée avec plateau de 3 indices :
 * center = Math.floor(length / 2) et [center-1, center, center+1] = 1.
 * La décroissance vers 0 est calculée linéairement et indépendamment
 * pour chaque côté jusqu'à l'extrémité la plus proche.
 */
export function linearCenterWeight(index: number, length: number): number {
  if (length <= 1) return 1;

  const center = Math.floor(length / 2);
  const plateauRadius = 1;

  const leftEdge = center - plateauRadius; // bord gauche du plateau
  const rightEdge = center + plateauRadius; // bord droit du plateau
  const leftLen = leftEdge - 0; // distance du bord gauche du plateau à l'index 0
  const rightLen = length - 1 - rightEdge; // distance du bord droit du plateau à l'index length-1

  // Zone plate
  if (Math.abs(index - center) <= plateauRadius) return 1;

  // Côté gauche : décroît linéairement de leftEdge -> 0
  if (index < leftEdge) {
    const dist = leftEdge - index; // 1 à leftLen
    return leftLen === 0 ? 0 : Math.max(0, 1 - dist / leftLen);
  }

  // Côté droit : décroît linéairement de rightEdge -> (length-1)
  if (index > rightEdge) {
    const dist = index - rightEdge; // 1 à rightLen
    return rightLen === 0 ? 0 : Math.max(0, 1 - dist / rightLen);
  }

  // Entre leftEdge et rightEdge (devrait déjà être traité par le plateau)
  return 1;
}

/**
 * Interpolation linéaire entre deux points.
 * @param pointA - Valeur de départ (quand positionX = 0)
 * @param pointB - Valeur d'arrivée (quand positionX = 1)
 * @param positionX - Position entre 0 et 1 (0 → pointA, 1 → pointB)
 * @returns Valeur interpolée entre pointA et pointB
 */
export function linearInterpolationBetweenPoints({
  pointA,
  pointB,
  positionX,
}: {
  pointA: number;
  pointB: number;
  positionX: number;
}): number {
  return pointA + (pointB - pointA) * positionX;
}

export function isBetween({
  min,
  max,
  value,
}: {
  min: number;
  max: number;
  value: number;
}): boolean {
  return min <= value && max >= value;
}

export function reindexPosition({
  index,
  defaultLength,
  newLength,
}: {
  index: number;
  defaultLength: number;
  newLength: number;
}) {
  return Math.round((index / (defaultLength - 1)) * (newLength - 1));
}
