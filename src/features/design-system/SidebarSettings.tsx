import { useForm } from "react-hook-form";
import { useDesignSystemContext } from "./DesignSystemContext";
import styles from "./SidebarSettings.module.css";
import FormComponent from "../../ui/kit/FormComponent";
import InputText from "../../ui/kit/InputText";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { DesignSystemMetadata } from "../../domain/DesignSystemDomain";
import ImageLocalComponent from "../../ui/kit/ImageLocal";
import { isEqual } from "lodash";
import Popover from "../../ui/kit/Popover";
import ButtonImagePicker from "../../ui/kit/ButtonImagePicker";
import ImageSelectorPopover from "../home/ImageSelectorPopover";
import { usePresetDressing } from "../home/HomeQueries";
import { ButtonTertiary } from "../../ui/kit/Buttons";
import { MdFileDownload } from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { useModalContext } from "../../ui/kit/ModalContext";

function SidebarSettings() {
  const { designSystem } = useDesignSystemContext();
  const { presetDressing } = usePresetDressing();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: designSystem.metadata,
  });
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { openModal } = useModalContext();

  function handleSaveMetadata(newMetadata: DesignSystemMetadata) {
    if (isEqual(newMetadata, designSystem.metadata)) return;
    saveDesignSystem({
      designSystem: {
        ...designSystem,
        metadata: newMetadata,
      },
      isTmp: true,
    });
  }
  return (
    <form
      className={styles.sidebarSettings}
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit(handleSaveMetadata)}
    >
      <Popover>
        <Popover.Toggle id="banner-selector">
          <div className={styles.bannerContainer}>
            <ButtonImagePicker id="banner-selector" />
            <ImageLocalComponent srcPath={watch("banner")} />
          </div>
        </Popover.Toggle>
        <Popover.Body id="banner-selector" zIndex={200}>
          <ImageSelectorPopover
            width="398px"
            setValue={(value: string) => {
              setValue("banner", value);
              handleSubmit(handleSaveMetadata)();
            }}
            imagesPreset={presetDressing?.banners}
            value={watch("banner")}
          />
        </Popover.Body>
      </Popover>
      <div className={styles.bodyContainer}>
        <div className="row align-center gap-4">
          <Popover>
            <Popover.Toggle id="logo-selector">
              <div className={styles.logoContainer}>
                <ButtonImagePicker id="logo-selector" />
                <ImageLocalComponent srcPath={watch("logo")} />
              </div>
            </Popover.Toggle>
            <Popover.Body id="logo-selector" zIndex={200}>
              <ImageSelectorPopover
                width="180px"
                setValue={(value: string) => {
                  setValue("logo", value);
                  handleSubmit(handleSaveMetadata)();
                }}
                imagesPreset={presetDressing?.logos}
                value={watch("logo")}
              />
            </Popover.Body>
          </Popover>
          <div className="flex-1">
            <FormComponent
              label="Design system name"
              error={errors.designSystemName?.message}
            >
              <InputText
                {...register("designSystemName", { required: true })}
                onBlur={handleSubmit(handleSaveMetadata)}
              />
            </FormComponent>
          </div>
        </div>
        <div className="row justify-end">
          <Popover.Close closeCallback={() => openModal("exports")}>
            <ButtonTertiary>
              <MdFileDownload size={ICON_SIZE_MD} /> Exports management
            </ButtonTertiary>
          </Popover.Close>
        </div>
      </div>
    </form>
  );
}

export default SidebarSettings;
