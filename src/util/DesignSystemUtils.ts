import { ColorPalette, Shades } from "../domain/DesignSystemDomain";

/**
 * Insère une nouvelle entrée [clé unique, newValue] à l'index spécifié,
 * et retourne un nouveau Map (sans muter l'original).
 */
/**
 * Insère une nouvelle entrée [clé unique, newValue] à l'index spécifié,
 * et retourne un nouveau tableau Shades (sans muter l'original).
 * @param shades - Le tableau de tuples [clé, valeur]
 * @param newValue - La valeur à insérer
 * @param index - L'index auquel on insère la nouvelle entrée
 */
export const insertShadeAtIndex = (
  shades: Shades,
  newValue: string,
  index: number
): Shades => {
  // On génère une clé unique, par exemple basée sur "index00"
  const newUniqueKey: string = generateUniqueShadeKey(shades, `${index}00`);

  // Nouvelle entrée sous forme de tuple [clé, valeur]
  const newEntry: [string, string] = [newUniqueKey, newValue];

  // On insère dans un nouveau tableau, sans muter l'original
  const updatedShades = [
    ...shades.slice(0, index),
    newEntry,
    ...shades.slice(index),
  ];

  return updatedShades;
};

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param shades - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueShadeKey = (shades: Shades, baseKey: string): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (shades.some(([k]) => k === uniqueKey)) {
    uniqueKey = `${baseKey} (${counter})`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueColorPaletteKey = (colorPalettes: ColorPalette[], baseKey: string): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (colorPalettes.find(palette => palette.paletteName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter})`;
    counter++;
  }

  return uniqueKey;
};

export function objectToMap(obj: Map<string, string>): Map<string, string> {
  return new Map(Object.entries(obj));
}
