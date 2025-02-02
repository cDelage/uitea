import { useNavigate } from "react-router-dom";
import { ICON_SIZE_MD, ICON_SIZE_XXL } from "../../ui/UiConstants";
import styles from "./HomeActionButtons.module.css";
import { MdOutlineFolder, MdSquareFoot } from "react-icons/md";
import Modal from "../../ui/kit/Modal";
import FormComponent from "../../ui/kit/FormComponent";
import InputText from "../../ui/kit/InputText";
import { ButtonPrimary, ButtonTertiary } from "../../ui/kit/Buttons";
import { useForm } from "react-hook-form";
import { DesignSystemCreationPayload } from "../../domain/DesignSystemDomain";
import { useCreateDesignSystem } from "../design-system/DesignSystemQueries";
import { open } from "@tauri-apps/api/dialog";
import toast from "react-hot-toast";

function CreateDesignSystem() {
  const navigate = useNavigate();
  const { createDesignSystem } = useCreateDesignSystem();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DesignSystemCreationPayload>();

  async function handlePickFolder() {
    try {
      const folder = (await open({
        directory: true, // Permet de sélectionner uniquement les dossiers
        multiple: false, // Empêche la sélection multiple
        title: "Sélectionnez un dossier",
        defaultPath: ".", // Chemin par défaut
      })) as null | string;

      if (!folder) return;

      setValue("folderPath", folder);
    } catch (error) {
      toast.error(`Error while selecting the folder : ${error}`);
    }
  }

  function handleCreateDesignSystem(
    designSystemCreationPayload: DesignSystemCreationPayload
  ) {
    createDesignSystem(designSystemCreationPayload);
  }

  const folderPath = watch("folderPath");
  register("folderPath", { required: true });

  return (
    <Modal>
      <Modal.Toggle id="create-design-system">
        <button
          className={styles.homeActionButton}
          onClick={() => navigate("/design-system")}
        >
          <div className={styles.centerContainer}>
            <div className={styles.iconContainer}>
              <MdSquareFoot size={ICON_SIZE_XXL} />
            </div>
          </div>
          <div>new design system</div>
        </button>
      </Modal.Toggle>
      <Modal.Body id="create-design-system">
        <form onSubmit={handleSubmit(handleCreateDesignSystem)}>
          <Modal.Md>
            <h3>New design system</h3>

            <FormComponent label="Name" error={errors.name?.message}>
              <InputText {...register("name", { required: true })} />
            </FormComponent>
            <FormComponent label="Folder" error={errors.folderPath?.message}>
              <div className="row gap-4 align-center">
                <ButtonTertiary onClick={handlePickFolder}>
                  <MdOutlineFolder size={ICON_SIZE_MD} /> Folder
                </ButtonTertiary>
                {folderPath || "No location selected"}
              </div>
            </FormComponent>
          </Modal.Md>
          <Modal.Footer>
            <ButtonPrimary>Create</ButtonPrimary>
            <Modal.Close>
              <ButtonTertiary>Close</ButtonTertiary>
            </Modal.Close>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateDesignSystem;
