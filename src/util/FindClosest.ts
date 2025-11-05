import { Point } from './Interpolation';

export interface ClosestInterval {
  closestX: number;
  interval: number[];
}

export function findClosestInterval({
  getValueY,
  xArray,
  target = 0,
}: {
  xArray: number[];
  target?: number;
  getValueY: (index: number) => number;
}): ClosestInterval {
  const points: Point[] = xArray.map((x) => {
    return {
      x,
      y: getValueY(x),
    };
  });

  const closestIndex = points.reduce((acc, cur, index) => {
    if (index) {
      const isCurrentClosest = isNewNumberClosest({
        oldVal: points[acc].y,
        newVal: cur.y,
        target,
      });
      if (isCurrentClosest) return index;
    }
    return acc;
  }, 0);

  const newInterval = getNewInterval({
    index: closestIndex,
    points,
    target,
  });

  return {
    closestX: points[closestIndex].x,
    interval: newInterval,
  };
}

function getNewInterval({
  index,
  points,
  target = 0,
}: {
  index: number;
  points: Point[];
  target?: number;
}): number[] {
  switch (index) {
    case 0:
      return createInterval({
        a: points[0].x,
        b: points[1].x,
      });
    case points.length - 1:
      return createInterval({
        a: points[points.length - 1].x,
        b: points[points.length - 2].x,
      });
    default:
      const b: number = isNewNumberClosest({
        oldVal: points[index - 1].y,
        newVal: points[index + 1].y,
        target,
      })
        ? points[index + 1].x
        : points[index - 1].x;

      return createInterval({
        a: points[index].x,
        b,
      });
  }
}

function isNewNumberClosest({
  newVal,
  oldVal,
  target,
}: {
  oldVal: number;
  newVal: number;
  target: number;
}): boolean {
  return Math.abs(newVal - target) < Math.abs(oldVal - target);
}

/**
 * Crée un tableau de valeurs équidistantes entre a et b.
 *
 * @param params - Objet contenant :
 *  - length : le nombre d'éléments à générer
 *  - a, b : les bornes (l'ordre n'a pas d'importance)
 * @returns Un tableau de nombres équidistants entre a et b
 *
 * @example
 * createInterval({ length: 5, a: 0, b: 1 })
 * // → [0, 0.25, 0.5, 0.75, 1]
 */
export function createInterval({
  length = 5,
  a,
  b,
}: {
  length?: number;
  a: number;
  b: number;
}): number[] {
  if (length <= 1) return [a];

  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const step = (max - min) / (length - 1);

  const values = Array.from({ length }, (_, i) => min + i * step);
  return a > b ? values.reverse() : values;
}
