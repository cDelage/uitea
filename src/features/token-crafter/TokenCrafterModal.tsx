import { useDesignSystemContext } from "../design-system/DesignSystemContext";
import styles from "./TokenCrafter.module.css";
import TokenCrafterComponent from "./TokenCrafterComponent";

function TokenCrafterModal() {
  const { designSystem, tokenFamilies } = useDesignSystemContext();
  return (
    <div className={styles.modal}>
      <TokenCrafterComponent
        isModal={true}
        designSystem={designSystem}
        tokenFamilies={tokenFamilies}
      />
    </div>
  );
}

export default TokenCrafterModal;
