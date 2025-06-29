import Popover from "../../ui/kit/Popover";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import styles from "./TokenCrafter.module.css";
import { getRectSize } from "../../ui/UiConstants";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import { ColorCombinationCollection } from "../../domain/DesignSystemDomain";

function TokenGroupPopover({
  handleSetGroup,
  colorCombinationCollections,
}: {
  handleSetGroup: (group: string | undefined) => void;
  colorCombinationCollections: ColorCombinationCollection[];
}) {
  const { tokenFamilies, designSystem } = useTokenCrafterContext();

  return (
    <PreviewStyle $tokenFamilies={tokenFamilies} $designSystem={designSystem}>
      <Popover.Actions>
        {colorCombinationCollections.map((collection) => (
          <Popover.Tab
            key={collection.combinationName}
            clickEvent={() => handleSetGroup(collection.combinationName)}
          >
            <div className={styles.tokenPreviewTab}>
              <div className="row align-center gap-4">
                <div
                  className="palette-color"
                  style={{
                    ...getRectSize({ height: "var(--uidt-space-5)" }),
                    background: `var(--${collection.default?.background})`,
                    border: collection.default?.border
                      ? `var(--${collection.default?.border}) 1px solid`
                      : "transparent 1px solid",
                  }}
                ></div>
                <strong>{collection.combinationName}</strong>
              </div>
            </div>
          </Popover.Tab>
        ))}
      </Popover.Actions>
    </PreviewStyle>
  );
}

export default TokenGroupPopover;
