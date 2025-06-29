import { Table } from "../../ui/kit/Table";
import Loader from "../../ui/kit/Loader";
import { useFindAllRecentFiles } from "./HomeQueries";
import RecentFileDesignSystemTab from "./RecentFileDesignSystemTab";
import { DesignSystemMetadataHome } from "../../domain/DesignSystemDomain";
import {
  paletteBuilderFromFile,
  PaletteBuilderMetadata,
  PaletteBuilderPayload,
} from "../../domain/PaletteBuilderDomain";
import RecentFilePaletteBuilderTab from "./RecentFilePaletteBuilderTab";
import { useNavigate } from "react-router-dom";
import { usePaletteBuilderStore } from "../palette-builder/PaletteBuilderStore";
import { invoke } from "@tauri-apps/api";
import Popover from "../../ui/kit/Popover";

function RecentFiles() {
  const { recentFiles, isLoadingRecentFiles } = useFindAllRecentFiles();
  const { loadPaletteBuilder } = usePaletteBuilderStore();
  const navigate = useNavigate();

  function isDesignSystem(
    obj: DesignSystemMetadataHome | PaletteBuilderMetadata
  ): obj is DesignSystemMetadataHome {
    return "designSystemId" in obj;
  }

  function isPaletteBuilder(
    obj: DesignSystemMetadataHome | PaletteBuilderMetadata
  ): obj is PaletteBuilderMetadata {
    return "paletteBuilderName" in obj;
  }

  async function handleFileClick(
    recentFile: DesignSystemMetadataHome | PaletteBuilderMetadata
  ) {
    if (isDesignSystem(recentFile)) {
      navigate(
        `/design-system/${encodeURIComponent(
          recentFile.designSystemPath
        )}?editMode=${recentFile.editMode ? "true" : "false"}`
      );
    }
    if (isPaletteBuilder(recentFile)) {
      const paletteBuilderFile = await invoke<PaletteBuilderPayload>(
        "load_palette_builder",
        { path: recentFile.path }
      );
      const paletteBuilder = paletteBuilderFromFile(paletteBuilderFile);
      loadPaletteBuilder(paletteBuilder.palettes, paletteBuilder.settings);
      navigate(`palette-builder`);
    }
  }

  if (isLoadingRecentFiles) return <Loader />;

  return (
    <Popover>
      <Table>
        <colgroup>
          <col style={{ width: "95%" }} />
          <col style={{ width: "5%" }} />
        </colgroup>
        <thead>
          <tr>
            <td
              style={{
                background: "var(--uidt-base-background)",
              }}
            >
              Recent file
            </td>
            <td
              style={{
                background: "var(--uidt-base-background)",
              }}
            >
              Actions
            </td>
          </tr>
        </thead>
        <tbody>
          {recentFiles?.map((recentFile, index) => (
            <tr
              key={`${
                isDesignSystem(recentFile)
                  ? recentFile.designSystemId
                  : recentFile.paletteBuilderName
              }`}
              className="hoverable"
              onClick={() => handleFileClick(recentFile)}
            >
              {isDesignSystem(recentFile) && (
                <RecentFileDesignSystemTab designSystemMetadata={recentFile} index={index}/>
              )}
              {isPaletteBuilder(recentFile) && (
                <RecentFilePaletteBuilderTab
                  paletteBuilderMetadata={recentFile}
                  open={handleFileClick}
                  index={index}
                />
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Popover>
  );
}

export default RecentFiles;
