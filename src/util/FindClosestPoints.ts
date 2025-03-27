import { Point } from "../features/design-system/PaletteBuilder3/PaletteBuilder3Store";

function findBefore<T>(from: number, arr: (T | undefined)[]): number | null {
  for (let i = from - 1; i >= 0; i--) {
    if (arr[i] !== undefined) return i;
  }
  return null;
}

function findAfter<T>(from: number, arr: (T | undefined)[]): number | null {
  for (let i = from + 1; i < arr.length; i++) {
    if (arr[i] !== undefined) return i;
  }
  return null;
}

function getNthBefore<T>(
  from: number,
  arr: (T | undefined)[],
  n: number
): number | null {
  let idx: number | null = from;
  for (let i = 0; i < n; i++) {
    idx = idx !== null ? findBefore(idx, arr) : null;
    if (idx === null) return null;
  }
  return idx;
}

function getNthAfter<T>(
  from: number,
  arr: (T | undefined)[],
  n: number
): number | null {
  let idx: number | null = from;
  for (let i = 0; i < n; i++) {
    idx = idx !== null ? findAfter(idx, arr) : null;
    if (idx === null) return null;
  }
  return idx;
}

export function getClosestThree<T>(
  arr: (T | undefined)[],
  index: number
): [T, T, T] {
  // Cas particulier : index === 0
  if (index === 0) {
    const a = arr[0] as T;
    const bIndex = getNthAfter(0, arr, 1);
    const cIndex = getNthAfter(0, arr, 2);
    if (bIndex === null || cIndex === null) {
      throw new Error("Pas assez d'éléments définis");
    }
    return [a, arr[bIndex] as T, arr[cIndex] as T];
  }

  // Si l'élément à l'index est défini
  if (arr[index] !== undefined) {
    const b = arr[index] as T;
    const left = findBefore(index, arr);
    const right = findAfter(index, arr);
    if (left !== null && right !== null) {
      return [arr[left] as T, b, arr[right] as T];
    } else if (left !== null) {
      const left2 = getNthBefore(index, arr, 2);
      if (left2 !== null) {
        return [arr[left2] as T, arr[left] as T, b];
      }
    } else if (right !== null) {
      const right2 = getNthAfter(index, arr, 2);
      if (right2 !== null) {
        return [b, arr[right] as T, arr[right2] as T];
      }
    }
    throw new Error("Pas assez d'éléments définis");
  } else {
    // Si l'élément à l'index est undefined, on favorise les éléments avant
    const left1 = findBefore(index, arr);
    if (left1 !== null) {
      const left2 = findBefore(left1, arr);
      if (left2 !== null) {
        const right = findAfter(index, arr);
        if (right !== null) {
          return [arr[left2] as T, arr[left1] as T, arr[right] as T];
        } else {
          const left3 = findBefore(left2, arr);
          if (left3 !== null) {
            return [arr[left3] as T, arr[left2] as T, arr[left1] as T];
          }
        }
      } else {
        const right1 = findAfter(index, arr);
        if (right1 !== null) {
          const right2 = findAfter(right1, arr);
          if (right2 !== null) {
            return [arr[left1] as T, arr[right1] as T, arr[right2] as T];
          }
        }
      }
    } else {
      // Aucun élément défini avant : on prend les trois suivants
      const firstAfter = findAfter(index, arr);
      if (firstAfter !== null) {
        const secondAfter = findAfter(firstAfter, arr);
        if (secondAfter !== null) {
          const thirdAfter = findAfter(secondAfter, arr);
          if (thirdAfter !== null) {
            return [
              arr[firstAfter] as T,
              arr[secondAfter] as T,
              arr[thirdAfter] as T,
            ];
          }
        }
      }
    }
    throw new Error("Pas assez d'éléments définis");
  }
}

export function getClosestTwo(
  arr: (Point | undefined)[],
  index: number
): [Point, Point] {
  const next : Point = arr.find((point) => point && point.x > index) ?? {
    x: 1,
    y: 1
  };
  const previous = arr.reduce<Point>(
    (acc, point) => {
      if (!point) return acc;
      return point?.x < index && acc.x <= point?.x ? point : acc;
    },
    {
      x: 0,
      y: 0,
    }
  );
  return [previous, next]
}
