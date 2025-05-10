// CursorPortal.tsx
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = { children: React.ReactNode };

export default function CursorPortal({ children }: Props) {
  // ⬅️ 1) le conteneur est dans le state
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);

  /* -------------------------------------------------
   * 2) Création / destruction du conteneur
   *    useLayoutEffect = avant le paint → pas de “flash”
   * ------------------------------------------------- */
  useLayoutEffect(() => {
    const node = document.createElement("div");
    Object.assign(node.style, {
      position: "fixed",
      top: "0",
      left: "0",
      pointerEvents: "none",
      zIndex: "2147483647",
    });
    document.body.appendChild(node);
    setContainer(node);          // ← déclenche le re‑rendu

    return () => {
      document.body.removeChild(node);
    };
  }, []);

  /* -------------------------------------------------
   * 3) Suivi du curseur
   * ------------------------------------------------- */
  useEffect(() => {
    if (!container) return;      // rien tant que le node n’existe pas

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId.current ?? 0);
      rafId.current = requestAnimationFrame(() => {
        container.style.transform = `translate3d(${e.clientX + 8}px,${
          e.clientY + 8
        }px,0)`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [container]);

  /* -------------------------------------------------
   * 4) Rendu
   * ------------------------------------------------- */
  return container ? createPortal(children, container) : null;
}
