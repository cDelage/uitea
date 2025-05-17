import { useParams } from "react-router-dom";
import Popover from "../../../ui/kit/Popover";
import { SPACES_PRESETS } from "../../../ui/UiConstants";
import { useSaveDesignSystem } from "../DesignSystemQueries";
import { useDesignSystemContext } from "../DesignSystemContext";
import { Space } from "../../../domain/DesignSystemDomain";
import { isEqual } from "lodash";

function SpacesPresetPopover() {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);

  function setPreset(spaces: Space[]) {
    if (!isEqual(spaces, designSystem.spaces))
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          spaces,
        },
        isTmp: true,
      });
  }
  return (
    <Popover.Actions width="250px">
      {SPACES_PRESETS.map((preset) => (
        <Popover.Tab
          key={preset.presetName}
          clickEvent={() => setPreset(preset.spaces)}
        >
          {preset.presetName}
        </Popover.Tab>
      ))}
    </Popover.Actions>
  );
}

export default SpacesPresetPopover;
