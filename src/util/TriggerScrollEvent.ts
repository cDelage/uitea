import { RefObject, useEffect } from "react";

export type TriggerScrollEvent = CustomEvent<{ id: string }>;

export function useTriggerScroll({
  ref,
  triggerId,
}: {
  ref: RefObject<HTMLFormElement | null>;
  triggerId: string;
}) {
  useEffect(() => {
    function handleTriggerScroll(e: TriggerScrollEvent) {
      if (e.detail.id === triggerId) {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
  }, [ref, triggerId]);
}
