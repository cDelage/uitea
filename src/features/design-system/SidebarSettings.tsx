import { useForm } from "react-hook-form";
import { useDesignSystemContext } from "./DesignSystemContext";
import { MdSettings } from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import styles from "./SidebarSettings.module.css";
import classNames from "classnames";
import FormComponent from "../../ui/kit/FormComponent";
import InputText from "../../ui/kit/InputText";
import Switch from "../../ui/kit/Switch";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "./DesignSystemQueries";
import { DesignSystemMetadata } from "../../domain/DesignSystemDomain";

function SidebarSettings() {
  const { designSystem } = useDesignSystemContext();
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

  const formClassNames = classNames(styles.sidebarSettings, "popover-body");

  function handleSaveMetadata(newMetadata: DesignSystemMetadata) {
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
      className={formClassNames}
      onSubmit={handleSubmit(handleSaveMetadata)}
    >
      <div className="row align-center gap-2">
        <MdSettings size={ICON_SIZE_MD} />
        <h3>Settings</h3>
      </div>
      <FormComponent
        label="Design system name"
        error={errors.designSystemName?.message}
      >
        <InputText
          {...register("designSystemName", { required: true })}
          onBlur={handleSubmit(handleSaveMetadata)}
        />
      </FormComponent>
      <FormComponent label="Dark mode" error={errors.designSystemName?.message}>
        <Switch
          checked={watch("darkMode")}
          onChange={(e) => {
            setValue("darkMode", e?.target.checked ?? false);
            handleSubmit(handleSaveMetadata)();
          }}
        />
      </FormComponent>
    </form>
  );
}

export default SidebarSettings;
