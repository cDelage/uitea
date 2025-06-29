import {
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { useDivClickOutside } from "../../util/DivClickOutside";
import styles from "./SidePanel.module.css";
import { SidepanelContext, useSidepanelContext } from "./SidepanelContext";

function SidePanel({
  children,
  background,
  closeCallback,
  isOpenToSync,
  setIsOpenToSync,
  defaultOpen,
  triggerOpen,
  setTriggerOpen
}: {
  children: ReactNode;
  background?: boolean;
  closeCallback?: () => void;
  isOpenToSync?: boolean;
  setIsOpenToSync?: (value: boolean) => void;
  defaultOpen?: string;
  triggerOpen?: string;
  setTriggerOpen?: (value: string | undefined) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  function open(id: string) {
    setOpenId(id);
  }

  function toggle(id: string) {
    setOpenId(id === openId ? null : id);
  }

  function close(id: string) {
    if (openId === id) {
      setOpenId(null);
      closeCallback?.();
    }
  }

  useEffect(() => {
    if (isOpenToSync && !openId && setIsOpenToSync) {
      setIsOpenToSync(false);
    } else if (!isOpenToSync && openId && setIsOpenToSync) {
      setIsOpenToSync(true);
    }
  }, [openId, isOpenToSync, setIsOpenToSync]);

  useEffect(() => {
    if(triggerOpen && setTriggerOpen){
      open(triggerOpen)
      setTriggerOpen(undefined);
    }
  },[triggerOpen, setTriggerOpen])

  return (
    <SidepanelContext.Provider
      value={{
        openModalId: openId,
        openModal: open,
        closeModal: close,
        toggleModal: toggle,
      }}
    >
      {background && <SidePannelBackground />}
      {children}
    </SidepanelContext.Provider>
  );
}

function SidePannelBackground() {
  const { openModalId } = useSidepanelContext();
  if (!openModalId) return;
  return createPortal(
    (<div className={styles.sidePanelContainer} />) as ReactElement,
    document.body
  );
}

function SidePanelButton({
  children,
  id,
  callback,
  stopClose,
}: {
  children: ReactNode;
  id: string;
  callback?: () => void;
  stopClose?: boolean;
}) {
  const { toggleModal, openModalId } = useSidepanelContext();

  return cloneElement(
    children as ReactElement<{
      onClick?: () => void;
      "data-disableoutside": boolean;
    }>,
    {
      onClick: () => {
        callback?.();
        if (!stopClose || openModalId !== id) {
          toggleModal(id);
        }
      },
      "data-disableoutside": true,
    }
  );
}

function SidePanelBody({
  children,
  id,
  width,
  background
}: {
  children: ReactNode;
  id: string;
  width?: string;
  background?: string;
}) {
  const { openModalId, closeModal } = useSidepanelContext();
  const refModalBody = useDivClickOutside(() => {
    if (openModalId === id) setTimeout(() => closeModal(id), 0);
  });

  return createPortal(
    <CSSTransition
      in={openModalId === id}
      timeout={200}
      mountOnEnter
      unmountOnExit
      nodeRef={refModalBody}
      classNames="modal"
    >
      <div
        className={styles.sidePanelBody}
        ref={refModalBody}
        style={{
          width,
          background
        }}
      >
        {children}
      </div>
    </CSSTransition>,
    document.body
  );
}

function SidePanelBodyRelative({
  children,
  id,
  width,
}: {
  children: ReactNode;
  id: string;
  width?: string;
}) {
  const { openModalId, closeModal } = useSidepanelContext();
  const refModalBody = useDivClickOutside(() => {
    if (openModalId === id) setTimeout(() => closeModal(id), 0);
  });
  const isOpen: boolean = openModalId === id;
  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={200}
        mountOnEnter
        unmountOnExit
        classNames="modal"
        nodeRef={refModalBody}
      >
        <div
          className={styles.sidePanelBody}
          style={{
            width,
          }}
          ref={refModalBody}
        >
          {children}
        </div>
      </CSSTransition>
    </>
  );
}

SidePanel.Button = SidePanelButton;
SidePanel.Body = SidePanelBody;
SidePanel.BodyRelative = SidePanelBodyRelative;
export default SidePanel;
