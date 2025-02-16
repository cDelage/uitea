import Popover from "../../ui/kit/Popover";
import { usePopoverContext } from "../../ui/kit/PopoverContext";
import { ReactNode } from "react";

function InputDesignSystemPopover({
  isHover,
  popoverBody,
  openId,
  children
}: {
  isHover: boolean;
  popoverBody: ReactNode;
  openId: string;
  children: ReactNode;
}) {
  const { openPopoverId } = usePopoverContext();
  const display = isHover || openPopoverId === openId;
  if (!display) return null;
  return (
    <>
      <Popover.Toggle id={openId} positionPayload="top-right">
        {children}
      </Popover.Toggle>
      <Popover.Body id={openId}>{popoverBody}</Popover.Body>
    </>
  );
}

export default InputDesignSystemPopover;
