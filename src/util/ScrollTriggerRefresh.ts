import { useEffect, useRef } from "react";

export function useScrollTriggerRefresh() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleScroll() {
      document.dispatchEvent(new CustomEvent("refresh-scroll"));
    }
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (element) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollRef]);
  return { scrollRef };
}
