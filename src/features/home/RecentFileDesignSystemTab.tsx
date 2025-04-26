import { MdMoreHoriz, MdOpenInNew, MdSquareFoot } from "react-icons/md";
import { DesignSystemMetadataHome } from "../../domain/DesignSystemDomain";
import { GhostButton } from "../../ui/kit/Buttons";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import { useNavigate } from "react-router-dom";
import Popover from "../../ui/kit/Popover";
import Modal from "../../ui/kit/Modal";
import ModalRemoveRecentFile from "./ModalRemoveRecentFile";

function RecentFileDesignSystemTab({
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
    <>
      <td className="expand">
        <div className="row gap-6 align-center">
          <div className="column gap-2 align-center">
            <MdSquareFoot size={ICON_SIZE_XL} />
            <small>Design system</small>
          </div>
          <div className="column gap-2">
            <strong>{designSystemName}</strong>
            <small className="text-color-light">{designSystemPath}</small>
          </div>
        </div>
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
    </>
  );
}

export default RecentFileDesignSystemTab;
