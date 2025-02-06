import { Palette, Shade } from "../domain/DesignSystemDomain";

/**
 * Génère un nom unique pour une clé en vérifiant si elle existe déjà dans la liste de shades.
 * @param shades - Le tableau contenant les shades existants.
 * @param baseKey - Le nom de la clé à insérer.
 * @returns Un nom unique pour la clé.
 */
export const generateUniqueShadeKey = (
  shades: Shade[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  // Tant que la clé existe déjà (on compare avec le premier élément du tuple),
  // on incrémente le "counter" pour générer une nouvelle clé.
  while (shades.filter((shade) => shade.label === uniqueKey).length) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};

export const generateUniqueColorPaletteKey = (
  colorPalettes: Palette[],
  baseKey: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (colorPalettes.find((palette) => palette.paletteName === uniqueKey)) {
    uniqueKey = `${baseKey}-${counter})`;
    counter++;
  }

  return uniqueKey;
};

export function objectToMap(obj: Map<string, string>): Map<string, string> {
  return new Map(Object.entries(obj));
}

/**
 * Vérifie si la chaîne `value` est interprétée comme un code couleur ou un gradient CSS valide
 * par le navigateur.
 */
export function isValidCssColorOrGradient(value: string): boolean {
  if (!value) return false;
  
  // On crée un élément DOM fictif
  const element = document.createElement('div');

  // On tente de lui attribuer 'value' en background
  element.style.background = value;

  // Si après l'attribution, la propriété `background` n'est plus vide,
  // c'est que le navigateur a reconnu la syntaxe comme valide.
  return element.style.background.length > 0;
}
