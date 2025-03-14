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
import { calcPositionVisible, getRectPosition } from "../../util/PositionUtil";
import { useDivClickOutside } from "../../util/DivClickOutside";
import { PopoverContext, usePopoverContext } from "./PopoverContext";
import styles from "./Popover.module.css";

const BodyDefault = styled.div<{
  $position: PositionAbsolute;
  $width?: number;
  $zIndex?: number;
}>`
  background-color: var(--theme-component-bg);
  border-radius: var(--rounded-md);
  border: 1px solid var(--theme-component-border);
  box-shadow: var(--shadow-md);
  position: absolute;
  z-index: ${(props) => props.$zIndex ?? 20};
  overflow: hidden;
  top: ${(props) => props.$position.top}px;
  bottom: ${(props) => props.$position.bottom}px;
  left: ${(props) => props.$position.left}px;
  right: ${(props) => props.$position.right}px;
  transform: ${(props) => props.$position.transform};
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
  const [toggleRect, setToggleRect] = useState<DOMRect | undefined>(undefined);

  function open(pos: PositionAbsolute, id: string, domRect: DOMRect) {
    setPosition(pos);
    setOpenId(id);
    setToggleRect(domRect);
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
        toggleRect,
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
  zIndex,
  closeCallback,
}: {
  children: ReactNode;
  id: string;
  zIndex?: number;
  closeCallback?: () => void;
}): JSX.Element | null {
  const { position, closePopover, openPopoverId, toggleRect } =
    usePopoverContext();
  function handleClose() {
    closePopover();
    closeCallback?.();
  }

  const ref = useDivClickOutside(handleClose);

  const positionVisible =
    position && openPopoverId === id
      ? calcPositionVisible(
          position,
          ref.current?.getBoundingClientRect(),
          toggleRect
        )
      : undefined;

  if (!positionVisible || position === null || openPopoverId !== id)
    return null;

  return createPortal(
    <BodyDefault
      $position={positionVisible}
      ref={ref}
      onMouseDown={(e) => e.stopPropagation()}
      $zIndex={zIndex}
    >
      {children}
    </BodyDefault>,
    document.body
  );
}

type ClosePopoverEvent = CustomEvent<{ keyPopover: string | undefined }>;

/**
 * Toggle menu
 */
function Toggle({
  children,
  id,
  positionPayload,
  disableButtonClosure,
  keyPopover,
}: {
  children: ReactNode;
  id: string;
  positionPayload?: PositionPayload;
  scrollListener?: string[];
  disableButtonClosure?: boolean;
  keyPopover?: string;
}): JSX.Element {
  const { openPopover, closePopover, openPopoverId, setPosition } =
    usePopoverContext();

  const toggleRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    const rect = toggleRef.current?.getBoundingClientRect();
    if (rect) {
      const menuPosition = getRectPosition(
        positionPayload || "bottom-left",
        rect
      );
      if (openPopoverId === "" || openPopoverId !== id) {
        openPopover(menuPosition, id, rect);
        document.dispatchEvent(
          new CustomEvent<{ keyPopover: string | undefined }>("open-popover", {
            detail: {
              keyPopover,
            },
          })
        );
      } else if (!disableButtonClosure) {
        closePopover();
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

  useEffect(() => {
    function handleClose(e: ClosePopoverEvent) {
      if (e.detail.keyPopover && e.detail.keyPopover !== keyPopover) {
        closePopover();
      }
    }

    if (openPopoverId === id) {
      document.addEventListener("open-popover", handleClose as EventListener);
    } else {
      document.removeEventListener(
        "open-popover",
        handleClose as EventListener
      );
    }

    return () => {
      document.removeEventListener(
        "open-popover",
        handleClose as EventListener
      );
    };
  }, [closePopover, keyPopover, openPopoverId, id]);

  return cloneElement(
    children as ReactElement<
      { onClick?: (e: MouseEvent) => void } & {
        ref?: React.Ref<HTMLButtonElement>;
      } & { onMouseDown?: (e: MouseEvent) => void }
    >,
    {
      onClick: handleClick,
      ref: toggleRef,
      onMouseDown: (e) => e.stopPropagation(),
    }
  );
}

function Close({ children }: { children: ReactNode }) {
  const { closePopover, openPopoverId } = usePopoverContext();

  function handleClick() {
    if (openPopoverId) {
      closePopover();
    }
  }

  return cloneElement(
    children as ReactElement<
      { onClick?: (e: MouseEvent) => void } & {} & {
        onMouseDown?: (e: MouseEvent) => void;
      }
    >,
    {
      onClick: handleClick,
      onMouseDown: (e) => e.stopPropagation(),
    }
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
  const { closePopover } = usePopoverContext();

  const handleClick = (e: MouseEvent) => {
    //When action trigger a modal opening, then do not close.
    e.stopPropagation();
    clickEvent?.();
    if (!disableClose) closePopover();
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
Popover.Close = Close;
export default Popover;
