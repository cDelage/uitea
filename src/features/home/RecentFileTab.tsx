import { MdMoreHoriz, MdOpenInNew } from "react-icons/md";
import { DesignSystemMetadataHome } from "../../domain/DesignSystemDomain";
import { GhostButton } from "../../ui/kit/Buttons";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { useNavigate } from "react-router-dom";
import Popover from "../../ui/kit/Popover";
import Modal from "../../ui/kit/Modal";
import ModalRemoveRecentFile from "./ModalRemoveRecentFile";

function RecentFileTab({
  designSystemMetadata: { designSystemName, designSystemPath, editMode },
}: {
  designSystemMetadata: DesignSystemMetadataHome;
}) {
  const navigate = useNavigate();

  function getPath() {
    return `/design-system/${encodeURIComponent(designSystemPath)}?editMode=${
      editMode ? "true" : "false"
    }`;
  }

  return (
    <tr onClick={() => navigate(getPath())}>
      <td className="column expand">
        <strong>{designSystemName}</strong>
        <small className="text-color-light">{designSystemPath}</small>
      </td>
      <td className="shrink">
        <Popover>
          <Popover.Toggle id="file-actions" positionPayload="bottom-right">
            <GhostButton>
              <MdMoreHoriz size={ICON_SIZE_MD} />
            </GhostButton>
          </Popover.Toggle>
          <Popover.Body id="file-actions">
            <Popover.Actions>
              <Popover.Tab clickEvent={() => navigate(getPath())}>
                <MdOpenInNew /> Open
              </Popover.Tab>
              <Modal>
                <ModalRemoveRecentFile recentFilePath={designSystemPath} />
              </Modal>
            </Popover.Actions>
          </Popover.Body>
        </Popover>
      </td>
    </tr>
  );
}

export default RecentFileTab;
