import { useEffect, useRef, RefObject, useState, useCallback } from "react";

type OutsideClickHandler = () => void;

export function useDivClickOutside(
  handler: OutsideClickHandler,
  listenCapturing = true,
  deactiveDisableOutside?: boolean
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mouseDownActive, setMouseDownActive] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !mouseDownActive
      ) {
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
    },
    [deactiveDisableOutside, handler, mouseDownActive]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (ref.current && ref.current.contains(e.target as Node)) {
      setMouseDownActive(true);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      setMouseDownActive(false);
    },100);
  }, []);

  useEffect(() => {
    if (mouseDownActive) {
      document.addEventListener("mouseup", handleMouseUp, listenCapturing);
    } else {
      document.addEventListener("mousedown", handleMouseDown, listenCapturing);
      document.addEventListener("click", handleClick, listenCapturing);
    }
    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
        listenCapturing
      );
      document.removeEventListener("mouseup", handleMouseUp, listenCapturing);
    };
  }, [
    listenCapturing,
    handleClick,
    mouseDownActive,
    handleMouseUp,
    handleMouseDown,
  ]);

  return ref;
}
