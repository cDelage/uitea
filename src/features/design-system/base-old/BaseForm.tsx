import { UseFormReturn } from "react-hook-form";
import InputDesignSystem from "../InputDesignSystem";
import { Base, DarkableCategory } from "../../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "../DesignSystemContext";

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
        value={form.getValues(`background.${darkableCategory}`)}
        register={form.register(`background.${darkableCategory}`)}
        tooltipValue="base-background"
        handleSubmit={handleSubmit}
        isColor={true}
        setValue={(value: string) =>
          form.setValue(`background.${darkableCategory}`, value)
        }
        computedColor={findDesignSystemColor({
          label: form.watch(`background.${darkableCategory}`),
        })}
      />
      <InputDesignSystem
        label="border"
        value={form.getValues(`border.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`border.${darkableCategory}`, value)
        }
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
        value={form.getValues(`textLight.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`textLight.${darkableCategory}`, value)
        }
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
        value={form.getValues(`textDefault.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`textDefault.${darkableCategory}`, value)
        }
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
        value={form.getValues(`textDark.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`textDark.${darkableCategory}`, value)
        }
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
        value={form.getValues(`backgroundDisabled.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`backgroundDisabled.${darkableCategory}`, value)
        }
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
        value={form.getValues(`borderDisabled.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`borderDisabled.${darkableCategory}`, value)
        }
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
        value={form.getValues(`textDisabled.${darkableCategory}`)}
        setValue={(value: string) =>
          form.setValue(`textDisabled.${darkableCategory}`, value)
        }
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
