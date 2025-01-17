import { useEffect, useRef, MutableRefObject } from "react";

type OutsideClickHandler = () => void;

export function useDivClickOutside(
  handler: OutsideClickHandler,
  listenCapturing = true
): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Vérification de la présence de ref.current
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Vérification si l'élément cliqué est un HTMLElement et possède une className
        const target = e.target as HTMLElement;
        if (
          target &&
          target.className &&
          target.className.includes("menu-button")
        ) {
          // Si l'élément cliqué a la classe "menu-button", ne rien faire
          return;
        }

        // Si l'élément cliqué n'est ni à l'intérieur de ref ni un bouton de menu
        handler();
      }
    }

    // Ajouter un événement de clic
    document.addEventListener("click", handleClick, listenCapturing);

    // Cleanup du listener d'événements
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
