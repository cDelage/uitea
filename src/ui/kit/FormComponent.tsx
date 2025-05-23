import { ReactNode } from "react";
import styles from "./FormComponent.module.css";
function FormComponent({
  children,
  label,
  error,
  className,
  rightElement,
}: {
  children: ReactNode;
  label: string;
  error?: string;
  className?: string;
  rightElement?: ReactNode;
}) {
  return (
    <div className={"column gap-4 " + className}>
      <div className="row justify-between">
        <label>{label}</label>
        <div>{rightElement}</div>
      </div>
      {children}
      <small className={styles.errorTheme}>{error}</small>
    </div>
  );
}

export default FormComponent;
