import {
  cloneElement,
  JSX,
  MouseEvent,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDivClickOutside } from "../../util/DivClickOutside";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import {
  ModalContext,
  ModalContextType,
  useModalContext,
} from "./ModalContext";

function Modal({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  function open(id: string) {
    setOpenId(id);
  }

  function close() {
    setOpenId(null);
  }

  return (
    <ModalContext.Provider
      value={{ openModalId: openId, openModal: open, closeModal: close }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function Toggle({
  children,
  id,
  openCallback,
  replaceOpen,
}: {
  children: ReactNode;
  id: string;
  replaceOpen?: () => void;
  openCallback?: () => void;
}) {
  const { openModal: open } = useContext(ModalContext) as ModalContextType;
  function handleOpen() {
    if (replaceOpen) {
      replaceOpen?.();
    } else {
      open(id);
      setTimeout(() => openCallback?.(), 0);
    }
  }
  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    onClick: handleOpen,
  });
}

function Body({
  children,
  id,
  isOpenToSync,
  setIsOpenToSync,
}: {
  children: ReactNode;
  id: string;
  isFull?: boolean;
  isOpenToSync?: boolean;
  setIsOpenToSync?: (value: boolean) => void;
}): JSX.Element | null {
  const { openModalId: openId, closeModal: close } = useContext(
    ModalContext
  ) as ModalContextType;
  const RefModalBody = useDivClickOutside(() => {
    close();
  });

  useEffect(() => {
    if (isOpenToSync && (!openId || openId !== id) && setIsOpenToSync) {
      setIsOpenToSync(false);
    } else if (!isOpenToSync && openId === id && setIsOpenToSync) {
      setIsOpenToSync(true);
    }
  }, [openId, isOpenToSync, setIsOpenToSync, id]);

  if (id !== openId) return null;

  function handleClickOverlay(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return createPortal(
    <div className={styles.overlay} onClick={handleClickOverlay}>
      <div className={styles.modal} ref={RefModalBody}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function Md({ children, width }: { children: ReactNode; width?: string }) {
  return (
    <div
      className={styles.modalBodyMd}
      style={{ width, minWidth: width, maxWidth: width }}
      data-disableoutside={true}
    >
      {children}
    </div>
  );
}

function ModalCustom({
  children,
  title,
  width,
}: {
  children: ReactNode;
  title: string;
  width?: string;
}) {
  return (
    <div
      className={styles.modalBodyCustom}
      style={{ width, minWidth: width, maxWidth: width }}
    >
      <div className={styles.modalCustomHeader}>
        <h5>{title}</h5>
      </div>
      {children}
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div className={styles.modalFooter} data-disableoutside={true}>
      {children}
    </div>
  );
}

function Close({ children }: { children: ReactNode }) {
  const { closeModal: close } = useModalContext();
  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    onClick: () => {
      close();
    },
  });
}

Modal.Toggle = Toggle;
Modal.Body = Body;
Modal.Md = Md;
Modal.Footer = Footer;
Modal.Close = Close;
Modal.Custom = ModalCustom;
export default Modal;
