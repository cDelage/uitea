export function getFilenameDate(): string {
  const now = new Date();

  // Récupérer le mois, le jour, l'année, les heures et les minutes
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // les mois vont de 0 à 11
  const day = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  // Construire la chaîne au format "MM/DD/YYYY_HH:MM"
  return `${month}-${day}-${year}_${hours}-${minutes}`;
}
