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
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
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
  isOpenToSync,
  setIsOpenToSync,
}: {
  children: ReactNode;
  id: string;
  zIndex?: number;
  skipDisableOutside?: boolean;
  isOpenToSync?: boolean;
  setIsOpenToSync?: (value: boolean) => void;
}): JSX.Element | null {
  const { position, closePopover, openPopoverId, toggleRect } =
    usePopoverContext();
  const popoverRef = useDivClickOutside(handleClose, true, skipDisableOutside);
  const [toClose, setToClose] = useState(false);
  const [positionVisible, setPositionVisible] = useState<
    PositionAbsolute | undefined
  >(undefined);

  useEffect(() => {
    if (isOpenToSync && !openPopoverId && setIsOpenToSync) {
      setIsOpenToSync(false);
    } else if (!isOpenToSync && openPopoverId === id && setIsOpenToSync) {
      setIsOpenToSync(true);
    }
  }, [openPopoverId, isOpenToSync, setIsOpenToSync, id]);

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

/**
 * Toggle menu
 */
function Toggle({
  children,
  id,
  positionPayload,
  disabled,
  disableClosure,
}: {
  children: ReactNode;
  id: string;
  positionPayload?: PositionPayload;
  disabled?: boolean;
  disableClosure?: boolean;
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
        } else if (!disableClosure) {
          closePopover(id);
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

function Actions({ children, width }: { children: ReactNode; width?: string }) {
  return (
    <div
      className="column overflow-hidden"
      style={{
        width,
        maxWidth: width,
      }}
      data-disableoutside={true}
    >
      {children}
    </div>
  );
}

function Tab({
  children,
  clickEvent,
  disableClose,
  theme,
  width,
}: {
  children: ReactNode;
  clickEvent?: () => void;
  disableClose?: boolean;
  theme?: "alert" | "disabled" | "primary";
  width?: string;
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
    [styles.tabPrimary]: theme === "primary",
  });
  return (
    <div
      className={tabStyle}
      style={{
        width,
        maxWidth: width,
      }}
      onClick={handleClick}
      data-disableoutside={true}
    >
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
  childWidth,
}: {
  children: ReactNode;
  id: number;
  selectNode: ReactNode;
  position?: PositionPayload;
  childWidth?: string;
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
          <SelectorChildren width={childWidth}>{selectNode}</SelectorChildren>
        </>
      )}
    </div>
  );
}

function SelectorChildren({
  children,
  width,
}: {
  children: ReactNode;
  width?: string;
}) {
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
        width,
      }}
      ref={childrenRef}
      data-disableoutside={true}
    >
      {children}
    </div>
  );
}

function SelectorButton({
  width,
  value,
  placeholder,
  onRemove,
  id,
  disabled,
}: {
  width?: string;
  value?: ReactNode;
  placeholder?: string;
  onRemove?: () => void;
  disabled?: boolean;
  id?: string;
}) {
  const { openPopoverId } = usePopoverContext();
  return (
    <div
      className={`popover-selector-button ${disabled ? "disabled" : ""}`}
      data-focus={openPopoverId === id}
      data-disabled={disabled ? true : false}
      style={{ width, minWidth: width, maxWidth: width }}
    >
      {value ? (
        <div className="uidt-text-color-default">{value}</div>
      ) : (
        <div className="uidt-text-color-light">{placeholder}</div>
      )}
      <div className="row gap-2 align-center">
        {onRemove && (
          <button
            className="action-ghost-button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <MdClose size={ICON_SIZE_SM} />
          </button>
        )}
        <MdChevronLeft
          size={ICON_SIZE_SM}
          style={{
            rotate: id === openPopoverId ? "-90deg" : "",
          }}
        />
      </div>
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
Popover.SelectorButton = SelectorButton;
export default Popover;
