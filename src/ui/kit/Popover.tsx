import {
  JSX,
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { PositionAbsolute, PositionPayload } from "./PositionAbsolute.type";
import {
  calcPositionVisible,
  checkPositionPayload,
  getOutsideAbsolutePosition,
  getRectPosition,
} from "../../util/PositionUtil";
import {
  PopoverContext,
  PopoverSelectorContext,
  usePopoverContext,
  usePopoverSelectorContext,
} from "./PopoverContext";
import styles from "./Popover.module.css";
import classNames from "classnames";
import { useDivClickOutside } from "../../util/DivClickOutside";
import { MdChevronRight } from "react-icons/md";
import { ICON_SIZE_SM } from "../UiConstants";

function Popover({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}): JSX.Element {
  const [position, setPosition] = useState<PositionAbsolute | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [toggleRect, setToggleRect] = useState<DOMRect | undefined>(undefined);

  function openPopover(pos: PositionAbsolute, id: string, domRect: DOMRect) {
    setPosition(pos);
    setOpenPopoverId(id);
    setToggleRect(domRect);
  }

  function closePopover(id: string) {
    if (id === openPopoverId) {
      onClose?.();
      setPosition(null);
      setOpenPopoverId(null);
    }
  }

  return (
    <PopoverContext.Provider
      value={{
        position,
        openPopover,
        closePopover,
        openPopoverId,
        setPosition,
        toggleRect,
        setToggleRect,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Body({
  children,
  id,
  zIndex,
  skipDisableOutside,
}: {
  children: ReactNode;
  id: string;
  zIndex?: number;
  skipDisableOutside?: boolean;
}): JSX.Element | null {
  const { position, closePopover, openPopoverId, toggleRect } =
    usePopoverContext();
  const popoverRef = useDivClickOutside(handleClose, true, skipDisableOutside);
  const [toClose, setToClose] = useState(false);
  const [positionVisible, setPositionVisible] = useState<
    PositionAbsolute | undefined
  >(undefined);

  function handleClose() {
    if (openPopoverId === id) {
      setToClose(true);
    }
  }

  useEffect(() => {
    if (toClose) {
      setToClose(false);
      if (openPopoverId === id) {
        closePopover(id);
      }
    }
  }, [toClose, id, closePopover, openPopoverId]);

  const shouldRender = position !== null && openPopoverId === id;

  useLayoutEffect(() => {
    if (popoverRef.current && shouldRender) {
      setPositionVisible(
        calcPositionVisible(
          position,
          popoverRef.current.getBoundingClientRect(),
          toggleRect
        )
      );
    }
  }, [position, popoverRef, toggleRect, id, openPopoverId, shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={styles.bodyDefault}
      style={{
        ...positionVisible,
        zIndex,
      }}
      ref={popoverRef}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
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
  keyPopover,
  disabled,
}: {
  children: ReactNode;
  id: string;
  positionPayload?: PositionPayload;
  scrollListener?: string[];
  keyPopover?: string;
  disabled?: boolean;
}): JSX.Element {
  const {
    openPopover,
    closePopover,
    openPopoverId,
    setPosition,
    setToggleRect,
  } = usePopoverContext();

  const toggleRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (!disabled) {
      const rect = toggleRef.current?.getBoundingClientRect();
      if (rect) {
        const menuPosition = getRectPosition(
          positionPayload || "bottom-left",
          rect
        );
        if (openPopoverId === "" || openPopoverId !== id) {
          openPopover(menuPosition, id, rect);
          document.dispatchEvent(
            new CustomEvent<{ keyPopover: string | undefined }>(
              "open-popover",
              {
                detail: {
                  keyPopover,
                },
              }
            )
          );
        }
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
      setToggleRect(toggleRef.current?.getBoundingClientRect());
    }

    document.addEventListener("refresh-scroll", handleSetPosition);
    return () => {
      document.removeEventListener("refresh-scroll", handleSetPosition);
    };
  }, [toggleRef, setPosition, positionPayload, setToggleRect]);

  useEffect(() => {
    function handleClose(e: ClosePopoverEvent) {
      if (e.detail.keyPopover && e.detail.keyPopover !== keyPopover) {
        closePopover(id);
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
        "data-disableoutside": boolean;
      } & { onMouseDown?: (e: MouseEvent) => void }
    >,
    {
      onClick: handleClick,
      ref: toggleRef,
      "data-disableoutside": true,
      onMouseDown: (e: MouseEvent) => e.stopPropagation(),
    }
  );
}

function Close({
  children,
  closeCallback,
}: {
  children: ReactNode;
  closeCallback?: () => void;
}) {
  const { closePopover, openPopoverId } = usePopoverContext();

  function handleClick() {
    if (openPopoverId) {
      closeCallback?.();
      closePopover(openPopoverId);
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
      onMouseDown: (e: MouseEvent) => e.stopPropagation(),
    }
  );
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="column" data-disableoutside={true}>
      {children}
    </div>
  );
}

function Tab({
  children,
  clickEvent,
  disableClose,
  theme,
}: {
  children: ReactNode;
  clickEvent?: () => void;
  disableClose?: boolean;
  theme?: "alert" | "disabled";
}) {
  const { closePopover, openPopoverId } = usePopoverContext();

  const handleClick = (e: MouseEvent) => {
    if (theme !== "disabled") {
      //When action trigger a modal opening, then do not close.
      e.stopPropagation();
      clickEvent?.();
      if (!disableClose) closePopover(openPopoverId ?? "");
    }
  };

  const tabStyle = classNames(styles.tab, {
    [styles.tabAlert]: theme === "alert",
    [styles.tabDisabled]: theme === "disabled",
  });
  return (
    <div className={tabStyle} onClick={handleClick} data-disableoutside={true}>
      {children}
    </div>
  );
}

function Selector({ children }: { children: ReactNode }) {
  const [activeSelectTab, setActiveSelectTab] = useState<number | undefined>(
    undefined
  );

  const [position, setPosition] = useState<PositionPayload>("top-right");
  const [initialPosition, setInitialPosition] =
    useState<PositionPayload>("top-right");

  return (
    <PopoverSelectorContext.Provider
      value={{
        activeSelectTab,
        setActiveSelectTab,
        position,
        setPosition,
        initialPosition,
        setInitialPosition,
      }}
    >
      {children}
    </PopoverSelectorContext.Provider>
  );
}

function SelectorTab({
  children,
  selectNode,
  id,
  position = "top-right",
}: {
  children: ReactNode;
  id: number;
  selectNode: ReactNode;
  position?: PositionPayload;
}) {
  const {
    setActiveSelectTab,
    setPosition,
    activeSelectTab,
    setInitialPosition,
  } = usePopoverSelectorContext();
  const active = id === activeSelectTab;
  function handleMouseEnter() {
    if (!active) {
      setActiveSelectTab(id);
      setPosition(position);
      setInitialPosition(position);
    }
  }

  return (
    <div
      className={styles.tabSelector}
      data-active={active}
      onMouseEnter={handleMouseEnter}
      data-disableoutside={true}
    >
      {children}
      {active && (
        <>
          <MdChevronRight size={ICON_SIZE_SM} />
          <SelectorChildren>{selectNode}</SelectorChildren>
        </>
      )}
    </div>
  );
}

function SelectorChildren({ children }: { children: ReactNode }) {
  const childrenRef = useRef<HTMLDivElement>(null);
  const { position, setPosition, initialPosition } =
    usePopoverSelectorContext();

  useEffect(() => {
    if (childrenRef.current) {
      const pos = checkPositionPayload(
        position,
        childrenRef.current.getBoundingClientRect()
      );
      if (pos !== position && pos !== initialPosition) {
        setPosition(pos);
      }
    }
  }, [childrenRef, position, setPosition, initialPosition]);
  return (
    <div
      className={styles.popoverSelectorChildren}
      style={{
        position: "absolute",
        ...getOutsideAbsolutePosition(position),
      }}
      ref={childrenRef}
      data-disableoutside={true}
    >
      {children}
    </div>
  );
}

Popover.Toggle = Toggle;
Popover.Body = Body;
Popover.Actions = Actions;
Popover.Tab = Tab;
Popover.Close = Close;
Popover.Selector = Selector;
Popover.SelectorTab = SelectorTab;
export default Popover;
