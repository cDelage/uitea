import {
  JSX,
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { PositionAbsolute, PositionPayload } from "./PositionAbsolute.type";
import { getRectPosition } from "../../util/PositionUtil";
import { useDivClickOutside } from "../../util/DivClickOutside";
import { PopoverContext, usePopoverContext } from "./PopoverContext";
import styles from "./Popover.module.css";

const BodyDefault = styled.div<{ position: PositionAbsolute; width?: number }>`
  background-color: var(--theme-component-bg);
  border-radius: var(--rounded-md);
  border: 1px solid var(--theme-component-border);
  box-shadow: var(--shadow-md);
  position: absolute;
  z-index: 10;
  overflow: hidden;
  top: ${(props) => props.position.top}px;
  bottom: ${(props) => props.position.bottom}px;
  left: ${(props) => props.position.left}px;
  right: ${(props) => props.position.right}px;
  transform: ${(props) => props.position.transform};
`;

function Popover({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}): JSX.Element {
  const [position, setPosition] = useState<PositionAbsolute | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  function open(pos: PositionAbsolute, id: string) {
    setPosition(pos);
    setOpenId(id);
  }

  function close() {
    onClose?.();
    setPosition(null);
    setOpenId(null);
  }

  return (
    <PopoverContext.Provider
      value={{
        position,
        openPopover: open,
        closePopover: close,
        openPopoverId: openId,
        setPosition,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

/**
 * Unorder list of action in the menu
 */
function Body({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}): JSX.Element | null {
  const {
    position,
    closePopover: close,
    openPopoverId: openId,
  } = usePopoverContext();
  const ref = useDivClickOutside(close, false);
  if (position === null || openId !== id) return null;

  return createPortal(
    <BodyDefault position={position} ref={ref}>
      {children}
    </BodyDefault>,
    document.body
  );
}

/**
 * Toggle menu
 */
function Toggle({
  children,
  id,
  positionPayload,
}: {
  children: ReactNode;
  id: string;
  positionPayload?: PositionPayload;
  scrollListener?: string[];
}): JSX.Element {
  const {
    openPopover: open,
    closePopover: close,
    openPopoverId: openId,
    setPosition,
  } = usePopoverContext();

  const toggleRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const rect = toggleRef.current?.getBoundingClientRect();
    if (rect) {
      const menuPosition = getRectPosition(
        positionPayload || "bottom-left",
        rect
      );
      if (openId === "" || openId !== id) {
        open(menuPosition, id);
      } else {
        close();
      }
    }
  }

  useEffect(() => {
    function handleSetPosition() {
      const rect = toggleRef.current?.getBoundingClientRect();
      const menuPosition = getRectPosition(
        positionPayload || "bottom-left",
        rect
      );
      setPosition(menuPosition);
    }

    document.addEventListener("refresh-scroll", handleSetPosition);
    return () => {
      document.removeEventListener("refresh-scroll", handleSetPosition);
    };
  }, [toggleRef, setPosition, positionPayload]);

  return cloneElement(
    children as ReactElement<
      { onClick?: (e: MouseEvent) => void } & {
        ref?: React.Ref<HTMLButtonElement>;
      }
    >,
    { onClick: handleClick, ref: toggleRef }
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="column">{children}</div>;
}

function Tab({
  children,
  clickEvent,
  disableClose,
}: {
  children: ReactNode;
  clickEvent?: () => void;
  disableClose?: boolean;
}) {
  const { closePopover: close } = usePopoverContext();

  const handleClick = (e: MouseEvent) => {
    //When action trigger a modal opening, then do not close.
    e.stopPropagation();
    clickEvent?.();
    if (!disableClose) close();
  };
  return (
    <div className={styles.tab} onClick={handleClick}>
      {children}
    </div>
  );
}

Popover.Toggle = Toggle;
Popover.Body = Body;
Popover.Actions = Actions;
Popover.Tab = Tab;
export default Popover;
