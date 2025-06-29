import { MdCheck, MdContentCopy } from "react-icons/md";
import { ICON_SIZE_SM } from "../UiConstants";
import { useCopy } from "../../util/CopyUtil";

function CopyableLabel({ copyable }: { copyable?: string }) {
  const { copy, isCopied } = useCopy();
  if (!copyable) return null;
  return (
    <div onClick={() => copy(copyable)} className="copyable-label">
      <div className="nowrap">{copyable}</div>
      <div>
        {isCopied ? (
          <MdCheck size={ICON_SIZE_SM} />
        ) : (
          <MdContentCopy size={ICON_SIZE_SM} />
        )}
      </div>
    </div>
  );
}

export default CopyableLabel;
