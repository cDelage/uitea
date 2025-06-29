import Popover from "../../ui/kit/Popover";
import styles from "./TokenCrafter.module.css";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import {
  PREVIEW_COMPONENT_ICONS,
  PreviewComponent,
} from "../../domain/DesignSystemDomain";

function TokenPreviewPopover({
  handleSetPreview,
}: {
  handleSetPreview: (previewComponent: PreviewComponent | undefined) => void;
}) {
  return (
    <Popover.Actions>
      {PREVIEW_COMPONENT_ICONS.map((component) => (
        <Popover.Tab
          key={component.previewComponent}
          clickEvent={() => handleSetPreview(component.previewComponent)}
        >
          <div className={styles.tokenPreviewTab}>
            {component.previewComponent}
            {component.icon({ size: ICON_SIZE_MD })}
          </div>
        </Popover.Tab>
      ))}
    </Popover.Actions>
  );
}

export default TokenPreviewPopover;
