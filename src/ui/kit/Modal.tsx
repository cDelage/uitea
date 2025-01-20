import {
  cloneElement,
  JSX,
  MouseEvent,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import { useDivClickOutside } from "../../util/useDivClickOutside";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import {
  ModalContext,
  ModalContextType,
  useModalContext,
} from "./useModalContext";

function Modal({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  function open(id: string) {
    setOpenId(id);
  }

  function close() {
    setOpenId(null);
  }

  return (
    <ModalContext.Provider value={{ openId, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Toggle({ children, id }: { children: ReactNode; id: string }) {
  const { open } = useContext(ModalContext) as ModalContextType;

  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    onClick: () => open(id),
  });
}

function Body({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
  isFull?: boolean;
}): JSX.Element | null {
  const { openId, close } = useContext(ModalContext) as ModalContextType;
  const RefModalBody = useDivClickOutside(close);
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

function Md({ children }: { children: ReactNode }) {
  return <div className={styles.modalBodyMd}>{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div className={styles.modalFooter}>{children}</div>;
}

function Close({ children }: { children: ReactNode }) {
  const { close } = useModalContext();
  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    onClick: () => close(),
  });
}

Modal.Toggle = Toggle;
Modal.Body = Body;
Modal.Md = Md;
Modal.Footer = Footer;
Modal.Close = Close;
export default Modal;
