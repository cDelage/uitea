import { FieldPath, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  DesignToken,
  SemanticColorTokens,
  TokenFamily,
} from "../../../domain/DesignSystemDomain";
import TokenSelector from "../../../ui/kit/TokenSelector";
import InputDesignSystem from "../InputDesignSystem";
import { findDesignSystemColor } from "../../../util/DesignSystemUtils";

function SemanticBaseInput({
  token,
  watch,
  setValue,
  onSubmit,
  label,
  tokenFamilies
}: {
  token: FieldPath<SemanticColorTokens>;
  watch: UseFormWatch<SemanticColorTokens>;
  setValue: UseFormSetValue<SemanticColorTokens>;
  onSubmit: () => void;
  label: string;
  tokenFamilies: TokenFamily[]
}) {
  return (
    <InputDesignSystem
      label={label}
      computedColor={findDesignSystemColor({
        label: watch(token) as string,
        tokenFamilies
      })}
      value={watch(token) as string}
      isColor={true}
      tooltipValue={`base-${label}`}
      popoverEdit={
        <TokenSelector
          tokensFamilies={tokenFamilies}
          onSelect={(designToken: DesignToken) => {
            setValue(token, designToken.label);
            onSubmit();
          }}
        />
      }
      popoverId={label}
    />
  );
}

export default SemanticBaseInput;
