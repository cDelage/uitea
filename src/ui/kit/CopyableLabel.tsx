import { useState } from "react";
import toast from "react-hot-toast";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { ICON_SIZE_SM } from "../UiConstants";

function CopyableLabel({ copyable }: { copyable: string }) {
  const [isCopied, setIsCopied] = useState(false);

  function copy() {
    navigator.clipboard
      .writeText(copyable)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Fail to copy ${copyable}`);
      });
  }
  return (
    <div onClick={copy} className="copyable-label">
      {copyable}
      {isCopied ? (
        <MdCheck size={ICON_SIZE_SM} />
      ) : (
        <MdContentCopy size={ICON_SIZE_SM} />
      )}
    </div>
  );
}

export default CopyableLabel;
