import { RefObject, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useSidebarComponentVisible(
  component: RefObject<HTMLFormElement | null>,
  id: string
) {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const locked = searchParams.get("locked-observer") === "true";
    const bodyDesignSystem = document.getElementById("body-design-system");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const visibles = searchParams.get("visible");
          if (visibles !== id) {
            searchParams.set("visible", id);
            setSearchParams(searchParams);
          }
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );
    if (locked) {
      observer.disconnect();

      function handleUnlock() {
        searchParams.set("locked-observer", "false");
        setSearchParams(searchParams);
        bodyDesignSystem?.removeEventListener("scroll", handleUnlock);
      }
      bodyDesignSystem?.addEventListener("scroll", handleUnlock, { passive: true });
    } else {
      observer.observe(component.current as Element);
    }

    return () => {
      observer.disconnect();
    };
  }, [id, searchParams, setSearchParams, component]);
}
