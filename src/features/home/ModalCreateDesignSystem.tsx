import { ICON_SIZE_MD, ICON_SIZE_XXL } from "../../ui/UiConstants";
import buttonStyles from "./HomeActionButtons.module.css";
import { MdOutlineFolder, MdSquareFoot } from "react-icons/md";
import Modal from "../../ui/kit/Modal";
import FormComponent from "../../ui/kit/FormComponent";
import InputText from "../../ui/kit/InputText";
import { useForm } from "react-hook-form";
import { DesignSystemCreationPayload } from "../../domain/DesignSystemDomain";
import { useCreateDesignSystem } from "../design-system/DesignSystemQueries";
import { open } from "@tauri-apps/plugin-dialog";
import toast from "react-hot-toast";
import { usePresetDressing } from "./HomeQueries";
import { useEffect } from "react";
import styles from "./ModalCreateDesignSystem.module.css";
import Loader from "../../ui/kit/Loader";
import ImageLocalComponent from "../../ui/kit/ImageLocal";
import Popover from "../../ui/kit/Popover";
import ImageSelectorPopover from "./ImageSelectorPopover";
import ButtonImagePicker from "../../ui/kit/ButtonImagePicker";
import { ButtonPrimary, ButtonTertiary } from "../../ui/kit/Buttons";

function ModalCreateDesignSystem() {
  const { createDesignSystem } = useCreateDesignSystem();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DesignSystemCreationPayload>({
    defaultValues: {
      name: undefined,
      folderPath: undefined,
    },
  });

  const { presetDressing, isLoadingPresetDressing } = usePresetDressing();

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
  register("folderPath", { required: "Location is required" });

  useEffect(() => {
    if (presetDressing?.banners[0]) {
      setValue("banner", presetDressing.banners[0]);
      setValue("logo", presetDressing.logos[0]);
    }
  }, [presetDressing, setValue]);

  const banner = watch("banner");
  const logo = watch("logo");

  if (isLoadingPresetDressing) return <Loader />;

  return (
    <Modal>
      <Modal.Toggle id="create-design-system">
        <button className={buttonStyles.homeActionButton}>
          <div className={buttonStyles.centerContainer}>
            <div className={buttonStyles.iconContainer}>
              <MdSquareFoot size={ICON_SIZE_XXL} />
            </div>
          </div>
          <div>Create design system</div>
        </button>
      </Modal.Toggle>
      <Modal.Body id="create-design-system">
        <form onSubmit={handleSubmit(handleCreateDesignSystem)}>
          <Modal.Custom title="New design system">
            <Popover>
              <Popover.Toggle id="banner-selector">
                <div className={styles.presetBanner}>
                  <ButtonImagePicker id="banner-selector" />
                  <ImageLocalComponent srcPath={banner} />
                </div>
              </Popover.Toggle>
              <Popover.Body id="banner-selector" zIndex={40}>
                <ImageSelectorPopover
                  width={"498px"}
                  imagesPreset={presetDressing?.banners}
                  value={watch("banner")}
                  setValue={(value: string) => setValue("banner", value)}
                />
              </Popover.Body>
            </Popover>
            <Modal.Md>
              <div className="row gap-4 align-center">
                <Popover>
                  <Popover.Toggle id="banner-selector">
                    <div className={styles.logoContainer}>
                      <ButtonImagePicker id="banner-selector" />
                      <ImageLocalComponent srcPath={logo} />
                    </div>
                  </Popover.Toggle>
                  <Popover.Body id="banner-selector" zIndex={40}>
                    <ImageSelectorPopover
                      width={"150px"}
                      imagesPreset={presetDressing?.logos}
                      value={watch("logo")}
                      setValue={(value: string) => setValue("logo", value)}
                    />
                  </Popover.Body>
                </Popover>
                <div className="flex-1">
                  <FormComponent label="Name" error={errors.name?.message}>
                    <InputText
                      {...register("name", {
                        required: "Project name is required",
                      })}
                    />
                  </FormComponent>
                </div>
              </div>
              <FormComponent label="Folder" error={errors.folderPath?.message}>
                <div className="row gap-4 align-center">
                  <ButtonTertiary onClick={handlePickFolder} type="button">
                    <MdOutlineFolder size={ICON_SIZE_MD} /> Folder
                  </ButtonTertiary>
                  {folderPath || "No location selected"}
                </div>
              </FormComponent>
            </Modal.Md>
          </Modal.Custom>
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

export default ModalCreateDesignSystem;
