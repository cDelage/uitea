import { useState } from "react";
import toast from "react-hot-toast";

export function useCopy() {
  const [isCopied, setIsCopied] = useState(false);

  function copy(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Fail to copy ${value}`);
      });
  }

  return { copy, isCopied, setIsCopied };
}
