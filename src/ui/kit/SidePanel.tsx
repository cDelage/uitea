import { cloneElement, ReactElement, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { useDivClickOutside } from "../../util/DivClickOutside";
import styles from "./SidePanel.module.css";
import { SidepanelContext, useSidepanelContext } from "./SidepanelContext";

function SidePanel({
  children,
  background,
}: {
  children: ReactNode;
  background?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | undefined>(undefined);

  function open(id: string, key?: string) {
    setOpenId(id);
    setOpenKey(key);
  }

  function toggle(id: string, key?: string) {
    if (!openKey || openKey === key) {
      setOpenId(id === openId ? null : id);
    }
    setOpenKey(key);
  }

  function close(id: string) {
    if (openId === id) {
      setOpenId(null);
      setOpenKey(undefined);
    }
  }

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
  openKey,
  callback,
}: {
  children: ReactNode;
  id: string;
  openKey?: string;
  callback?: () => void;
}) {
  const { toggleModal } = useSidepanelContext();
  return cloneElement(
    children as ReactElement<{
      onClick?: () => void;
      "data-disableoutside": boolean;
    }>,
    {
      onClick: () => {
        callback?.();
        toggleModal(id, openKey);
      },
      "data-disableoutside": true,
    }
  );
}

function SidePanelBody({ children, id }: { children: ReactNode; id: string }) {
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
      <div className={styles.sidePanelBody} ref={refModalBody}>
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
  );
}

SidePanel.Button = SidePanelButton;
SidePanel.Body = SidePanelBody;
SidePanel.BodyRelative = SidePanelBodyRelative;
export default SidePanel;
