// useSynchronizedVerticalScroll.ts
import { useRef, useEffect, RefObject } from "react";

type UseSynchronizedVerticalScrollResult = [
  RefObject<HTMLDivElement | null>,
  RefObject<HTMLDivElement | null>
];

/**
 * useSynchronizedVerticalScroll
 * Renvoie deux refs (HTMLDivElement) dont le scroll vertical (scrollTop) est synchronisé
 */
export function useSynchronizedVerticalScroll(): UseSynchronizedVerticalScrollResult {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // Pour éviter le scroll "infini", on track la source du dernier scroll
  const scrollingSource = useRef<"ref1" | "ref2" | null>(null);

  useEffect(() => {
    const el1 = ref1.current;
    const el2 = ref2.current;
    if (!el1 || !el2) return;

    const handleScroll1 = () => {
      // Si le scroll vient de l'autre élément, on annule
      if (scrollingSource.current === "ref2") return;
      scrollingSource.current = "ref1";

      // Synchronise seulement la position verticale
      el2.scrollTop = el1.scrollTop;

      scrollingSource.current = null;
    };

    const handleScroll2 = () => {
      // Idem pour le 2e
      if (scrollingSource.current === "ref1") return;
      scrollingSource.current = "ref2";

      el1.scrollTop = el2.scrollTop;

      scrollingSource.current = null;
    };

    // On écoute l'événement 'scroll' sur chacun des éléments
    el1.addEventListener("scroll", handleScroll1, { passive: true });
    el2.addEventListener("scroll", handleScroll2), { passive: true };

    // On retire les listeners quand le composant se démonte
    return () => {
      el1.removeEventListener("scroll", handleScroll1);
      el2.removeEventListener("scroll", handleScroll2);
    };
  }, []);

  return [ref1, ref2];
}
