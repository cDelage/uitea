import { useEffect } from "react";
import { FieldValues, UseFormReset } from "react-hook-form";

export function useRefreshDesignSystemFormsEvent<T extends FieldValues>({
  reset,
  originalValue,
}: {
  reset: UseFormReset<T>;
  originalValue: T;
}) {

  useEffect(() => {
    function handleRefreshDesignSystemForms() {
      reset(originalValue);
    }

    document.addEventListener(
      "refresh-design-system-forms",
      handleRefreshDesignSystemForms
    );

    return () => {
      document.removeEventListener(
        "refresh-design-system-forms",
        handleRefreshDesignSystemForms
      );
    };
  }, [reset, originalValue]);
}
