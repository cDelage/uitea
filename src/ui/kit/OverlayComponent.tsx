import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  useRef,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { CSSProperties } from "styled-components";

function OverlayComponent({
  children,
  zIndex,
}: {
  children: ReactNode;
  zIndex?: number;
}) {
  const emptyRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<DOMRect>();

  // helper pour récupérer tous les parents scrollables
  function getScrollParents(el: HTMLElement): HTMLElement[] {
    const parents: HTMLElement[] = [];
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }

  useEffect(() => {
    const update = () => {
      if (emptyRef.current) {
        setPos(emptyRef.current.getBoundingClientRect());
      }
    };
    update();

    // on récupère tous les scroll parents
    const scrollableParents = emptyRef.current
      ? getScrollParents(emptyRef.current)
      : [];
    // on y attache le listener
    scrollableParents.forEach((el) =>
      el.addEventListener("scroll", update, { passive: true })
    );
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      scrollableParents.forEach((el) =>
        el.removeEventListener("scroll", update)
      );
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const child = children as ReactElement<{
    ref?: React.Ref<HTMLElement>;
    style?: CSSProperties;
  }>;

  // 3) Clonage du child pour l’overlay, calé sur pos
  const portal = pos
    ? createPortal(
        cloneElement(child, {
          style: {
            ...child.props.style,
            position: "absolute",
            top: pos.y,
            left: pos.x,
            zIndex,
          },
        }),
        document.body
      )
    : null;

  return (
    <>
      <div ref={emptyRef}/>
      {portal}
    </>
  );
}

export default OverlayComponent;
