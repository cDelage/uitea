import { UseFormReturn } from "react-hook-form";
import InputDesignSystem from "./InputDesignSystem";
import { Base, DarkableCategory } from "../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "./DesignSystemContext";

function BaseForm({
  form,
  handleSubmit,
  darkableCategory,
}: {
  form: UseFormReturn<Base>;
  handleSubmit: () => void;
  darkableCategory: DarkableCategory;
}) {
  const { findDesignSystemColor } = useDesignSystemContext();
  return (
    <div className="column">
      <InputDesignSystem
        label="background"
        register={form.register(`background.${darkableCategory}`)}
        tooltipValue="base-background"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`background.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="border"
        register={form.register(`border.${darkableCategory}`)}
        tooltipValue="base-border"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`border.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="text-light"
        register={form.register(`textLight.${darkableCategory}`)}
        tooltipValue="base-text-light"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`textLight.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="text-default"
        register={form.register(`textDefault.${darkableCategory}`)}
        tooltipValue="base-text"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`textDefault.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="text-dark"
        register={form.register(`textDark.${darkableCategory}`)}
        tooltipValue="base-text-dark"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`textDark.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="background-disabled"
        register={form.register(`backgroundDisabled.${darkableCategory}`)}
        tooltipValue="base-background-disabled"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`backgroundDisabled.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="border-disabled"
        register={form.register(`borderDisabled.${darkableCategory}`)}
        tooltipValue="base-border-disabled"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`borderDisabled.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="text-disabled"
        register={form.register(`textDisabled.${darkableCategory}`)}
        tooltipValue="base-text-disabled"
        handleSubmit={handleSubmit}
        isColor={true}
        computedColor={findDesignSystemColor({
          label: form.watch(`textDisabled.${darkableCategory}`),
        })}
      />
    </div>
  );
}

export default BaseForm;
