export function moveItem<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  // Vérifier que les indices sont valides
  if (
    fromIndex < 0 ||
    fromIndex >= array.length ||
    toIndex < 0 ||
    toIndex > array.length
  ) {
    throw new Error("Indices non valides");
  }

  // Extraire l'élément
  const [item] = array.splice(fromIndex, 1);
  // Insérer l'élément à la nouvelle position
  array.splice(toIndex, 0, item);
  return array;
}
