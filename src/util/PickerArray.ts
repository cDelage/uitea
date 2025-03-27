import { ColorOkhsl } from "./PaletteBuilderTwoStore";

export function generateLoopArray({
  centerValue,
  gap,
  maxValue,
  minValue,
  length,
}: {
  centerValue: number;
  length: number;
  gap: number;
  maxValue: number;
  minValue: number;
}): number[] {
  // Calcul de l’index central et génération du tableau de base
  const centerIndex = Math.floor(length / 2);

  return Array.from({ length: length }, (_, i) => {
    const value = centerValue + (i - centerIndex) * gap;
    if (minValue > value) {
      return maxValue - (minValue - value);
    } else {
      return value % maxValue;
    }
  });
}

export function generateLinearArray({
  centerValue,
  gap,
  length,
  maxValue,
  minValue,
}: {
  centerValue: number;
  gap: number;
  length: number;
  minValue: number;
  maxValue: number;
}): number[] {
  if (gap === 0) {
    throw new Error('gap ne peut pas être 0.');
  }

  // On vérifie que l'intervalle total est suffisant pour contenir le tableau.
  if (Math.abs(maxValue - minValue) < Math.abs((length - 1) * gap)) {
    throw new Error('Impossible de générer un tableau avec les contraintes données.');
  }

  const centerIndex = Math.floor(length / 2);
  let start = centerValue - centerIndex * gap;

  if (gap > 0) {
    // Pour un tableau croissant :
    // Vérification du minimum sur le premier élément.
    if (start < minValue) {
      start = minValue;
    }
    // Vérification que le dernier élément ne dépasse pas maxValue.
    if (start + (length - 1) * gap > maxValue) {
      start = maxValue - (length - 1) * gap;
    }
  } else {
    // Pour un tableau décroissant (gap < 0) :
    // Le premier élément ne doit pas dépasser maxValue.
    if (start > maxValue) {
      start = maxValue;
    }
    // Le dernier élément ne doit pas être inférieur à minValue.
    if (start + (length - 1) * gap < minValue) {
      start = minValue - (length - 1) * gap;
    }
  }

  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    // On utilise toFixed pour éviter les imprécisions de calcul en virgule flottante.
    result.push(parseFloat((start + i * gap).toFixed(10)));
  }

  return result;
}

export interface ColorColumn {
  key: string;
  colors: ColorItem[];
}

export interface ColorItem {
  color: ColorOkhsl;
  active: boolean;
}
