import { RefObject, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export type TriggerScrollEvent = CustomEvent<{ id: string, direct?: boolean }>;

export function useTriggerScroll({
  ref,
  triggerId,
}: {
  ref: RefObject<HTMLFormElement | null>;
  triggerId: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const bodyDesignSystem = document.getElementById("body-design-system");

    function handleTriggerScroll(e: TriggerScrollEvent) {
      if (e.detail.id === triggerId) {
        
        ref.current?.scrollIntoView({
          behavior: e.detail.direct ? "auto" : "smooth",
          block: "start",
        });

        function handleLock() {
          searchParams.set("visible", e.detail.id);
          searchParams.set("locked-observer", "true");
          setSearchParams(searchParams);
          bodyDesignSystem?.removeEventListener("scrollend", handleLock);
        }

        bodyDesignSystem?.addEventListener("scrollend", handleLock);
      }
    }

    document.addEventListener(
      "triggerScroll",
      handleTriggerScroll as EventListener
    );

    return () => {
      document.removeEventListener(
        "triggerScroll",
        handleTriggerScroll as EventListener
      );
    };
  }, [ref, triggerId, searchParams, setSearchParams]);
}
