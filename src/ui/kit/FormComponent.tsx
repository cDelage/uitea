import { ReactNode } from "react";
import styles from "./FormComponent.module.css";
function FormComponent({
  children,
  label,
  error,
  className,
}: {
  children: ReactNode;
  label: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={"column gap-4 " + className}>
      <label>{label}</label>
      {children}
      <small className={styles.errorTheme}>{error}</small>
    </div>
  );
}

export default FormComponent;
