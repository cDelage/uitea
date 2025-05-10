import Popover from "../../ui/kit/Popover";
import {
  PaletteBuild,
  PaletteBuilderMetadata,
} from "../../domain/PaletteBuilderDomain";
import {
  MdClose,
  MdDelete,
  MdMoreHoriz,
  MdSave,
  MdUpload,
} from "react-icons/md";
import { getRectSize, ICON_SIZE_MD } from "../../ui/UiConstants";
import { useState } from "react";
import { useRenamePaletteBuilder } from "./PaletteBuilderQueries";

function ExistingPaletteBuilderTab({
  paletteBuilderMetadata,
  loadPaletteBuilderFromPath,
  overwriteIntoDesignSystem,
  removePaletteBuilderFromDesignSystem,
  palettes,
  designSystemPath,
}: {
  paletteBuilderMetadata: PaletteBuilderMetadata;
  loadPaletteBuilderFromPath: (path: string) => void;
  overwriteIntoDesignSystem: (name: string) => void;
  removePaletteBuilderFromDesignSystem: (path: string) => void;
  palettes: PaletteBuild[];
  designSystemPath?: string;
}) {
  const [name, setName] = useState(paletteBuilderMetadata.paletteBuilderName);
  const { renamePaletteBuilder } = useRenamePaletteBuilder(designSystemPath);

  function handleBlur() {
    if (name && designSystemPath && name !== paletteBuilderMetadata.paletteBuilderName) {
      renamePaletteBuilder({
        designSystemPath,
        metadata: paletteBuilderMetadata,
        newName: name,
      });
    }
  }

  return (
    <tr key={paletteBuilderMetadata.paletteBuilderName}>
      <td className="expand column gap-2">
        <strong>
          <input
            className="inherit-input"
            value={name}
            onBlur={handleBlur}
            onChange={(e) => setName(e.target.value)}
          />
        </strong>
        <div className="max-w-full">
          <div className="row gap-3 flex-wrap">
            {paletteBuilderMetadata.mainColors.map((color) => (
              <div
                className="palette-color"
                key={color}
                style={{
                  ...getRectSize({ height: "var(--uidt-space-6)" }),
                  background: color,
                }}
              ></div>
            ))}
          </div>
        </div>
      </td>
      <td className="shrink">
        <Popover.Toggle
          id={`palette-builder-options-${paletteBuilderMetadata.paletteBuilderName}`}
          positionPayload="bottom-right"
        >
          <button className="action-ghost-button">
            <MdMoreHoriz size={ICON_SIZE_MD} />
          </button>
        </Popover.Toggle>
        <Popover.Body
          zIndex={50}
          id={`palette-builder-options-${paletteBuilderMetadata.paletteBuilderName}`}
        >
          <Popover.Actions>
            <Popover.Tab
              clickEvent={() => {
                if (paletteBuilderMetadata.path)
                  loadPaletteBuilderFromPath(paletteBuilderMetadata.path);
              }}
            >
              <MdUpload size={ICON_SIZE_MD} />
              Load palette builder
            </Popover.Tab>
            <Popover.Tab
              theme={!palettes.length ? "disabled" : undefined}
              clickEvent={() => {
                if (paletteBuilderMetadata.paletteBuilderName) {
                  overwriteIntoDesignSystem(paletteBuilderMetadata.paletteBuilderName);
                }
              }}
            >
              <MdSave size={ICON_SIZE_MD} />
              Overwrite palette builder
            </Popover.Tab>
          </Popover.Actions>
        </Popover.Body>
      </td>
      <td className="shrink">
        <Popover.Toggle
          id={`delete-builder-${paletteBuilderMetadata.paletteBuilderName}`}
          positionPayload="bottom-right"
        >
          <button className="action-ghost-button">
            <MdDelete size={ICON_SIZE_MD} />
          </button>
        </Popover.Toggle>
        <Popover.Body
          id={`delete-builder-${paletteBuilderMetadata.paletteBuilderName}`}
          key={paletteBuilderMetadata.paletteBuilderName}
          zIndex={100}
        >
          <Popover.Actions>
            <Popover.Tab>
              <MdClose size={ICON_SIZE_MD} /> Cancel
            </Popover.Tab>
            <Popover.Tab
              clickEvent={() => {
                if (paletteBuilderMetadata.path)
                  removePaletteBuilderFromDesignSystem(
                    paletteBuilderMetadata.path
                  );
              }}
              theme="alert"
            >
              <MdDelete size={ICON_SIZE_MD} /> Remove palette builder
            </Popover.Tab>
          </Popover.Actions>
        </Popover.Body>
      </td>
    </tr>
  );
}

export default ExistingPaletteBuilderTab;
