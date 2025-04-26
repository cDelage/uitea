import { MdConstruction, MdMoreHoriz, MdOpenInNew } from "react-icons/md";
import { PaletteBuilderMetadata } from "../../domain/PaletteBuilderDomain";
import { GhostButton } from "../../ui/kit/Buttons";
import Popover from "../../ui/kit/Popover";
import { ICON_SIZE_MD, ICON_SIZE_XL } from "../../ui/UiConstants";
import Modal from "../../ui/kit/Modal";
import { DesignSystemMetadataHome } from "../../domain/DesignSystemDomain";
import ModalRemoveRecentFile from "./ModalRemoveRecentFile";

function RecentFilePaletteBuilderTab({
  paletteBuilderMetadata,
  open,
}: {
  paletteBuilderMetadata: PaletteBuilderMetadata;
  open: (recentFile: DesignSystemMetadataHome | PaletteBuilderMetadata) => void;
}) {
  return (
    <>
      <td className="expand" >
        <div className="row gap-6 align-center">
          <div className="column gap-2 align-center">
            <MdConstruction size={ICON_SIZE_XL} />
            <small>Palette builder</small>
          </div>
          <div className="column gap-2">
            <strong>{paletteBuilderMetadata.paletteBuilderName}</strong>
            <small className="text-color-light">
              {paletteBuilderMetadata.path}
            </small>
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
              <Popover.Tab clickEvent={() => open(paletteBuilderMetadata)}>
                <MdOpenInNew /> Open
              </Popover.Tab>
              <Modal>
                <ModalRemoveRecentFile
                  recentFilePath={paletteBuilderMetadata.path ?? ""}
                />
              </Modal>
            </Popover.Actions>
          </Popover.Body>
        </Popover>
      </td>
    </>
  );
}

export default RecentFilePaletteBuilderTab;
