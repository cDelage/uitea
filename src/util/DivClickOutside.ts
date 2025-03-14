import { useEffect, useRef, RefObject } from "react";

type OutsideClickHandler = () => void;

export function useDivClickOutside(
  handler: OutsideClickHandler,
  listenCapturing = true,
  deactiveDisableOutside?: boolean
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Si le clic ne se fait pas à l'intérieur de ref.current
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;

        // Vérifier si l'élément cliqué ou l'un de ses parents contient l'attribut data-disableoutside
        if (
          target.closest("[data-disableoutside]") &&
          !deactiveDisableOutside
        ) {
          return;
        }

        // Si aucun parent ne possède data-disableoutside, on déclenche l'évènement
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing, deactiveDisableOutside]);

  return ref;
}
