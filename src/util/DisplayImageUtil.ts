import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = "";
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export function useImagesBinary() {
  const images: Map<string, string> = new Map();

  async function loadImages(imagesPath: string[]) {
    for (const image of imagesPath) {
      if (!images.get(image)) {
        // Lire le fichier en tant que binaire
        const fileBuffer = await readFile("avatar.png", { baseDir: BaseDirectory.Resource });
        // Convertir en base64
        const base64String = arrayBufferToBase64(fileBuffer);
        // Déduire le type MIME (ici, par exemple, 'image/png')
        const mimeType = "image/png"; // Vous pouvez adapter selon l'extension du fichier

        const imageBinary = `data:${mimeType};base64,${base64String}`;
        images.set(image, imageBinary);
      }
    }
  }

  return {
    images,
    loadImages,
  };
}
