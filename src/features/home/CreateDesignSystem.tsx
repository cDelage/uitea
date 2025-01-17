import { useNavigate } from "react-router-dom";
import { ICON_SIZE_XL } from "../../ui/UiConstants";
import styles from "./HomeActionButtons.module.css";
import { MdSquareFoot } from "react-icons/md";
import Modal from "../../ui/kit/Modal";

function CreateDesignSystem() {
  const navigate = useNavigate();

  return (
    <Modal>
      <Modal.Toggle id="create-design-system">
        <button
          className={styles.homeActionButton}
          onClick={() => navigate("/design-system")}
        >
          <div className={styles.centerContainer}>
            <div className={styles.iconContainer}>
              <MdSquareFoot size={ICON_SIZE_XL} />
            </div>
          </div>
          <div>new design system</div>
        </button>
      </Modal.Toggle>
      <Modal.Body id="create-design-system">Hello world</Modal.Body>
    </Modal>
  );
}

export default CreateDesignSystem;
