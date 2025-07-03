import { useState } from "react";
import Modal from "../../../ui/kit/Modal";
import { cssExport, generateTokenStudioFile } from "../../../util/Export";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useGenerateExport, useSaveReadme } from "../DesignSystemQueries";
import { ButtonPrimary } from "../../../ui/kit/Buttons";
import { MdDownload, MdFolder } from "react-icons/md";
import toast from "react-hot-toast";
import { EXPORT_CATEGORY } from "../../../domain/DesignSystemDomain";
import ExportItem from "./ExportItem";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../ui/kit/Loader";
import ExportLine from "./ExportLine";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { invoke } from "@tauri-apps/api/core";

function ExportModal() {
  const { designSystem } = useDesignSystemContext();
  const { generateExport, isGeneratingExport } = useGenerateExport();
  const { saveReadme, isSavingReadme } = useSaveReadme();
  const queryClient = useQueryClient();
  const [exportGenerated, setExportGenerated] = useState<EXPORT_CATEGORY[]>([
    "css",
    "figma",
    "readme",
  ]);

  function openExportFolder() {
    invoke("open_export_folder", {
      designSystemPath: designSystem.metadata.designSystemPath,
    });
  }

  function toggleExport(value: EXPORT_CATEGORY) {
    if (exportGenerated.includes(value)) {
      setExportGenerated(exportGenerated.filter((val) => val !== value));
    } else {
      setExportGenerated([...exportGenerated, value]);
    }
  }

  async function handleExportFigma() {
    const exportFigma = generateTokenStudioFile(designSystem);
    await generateExport(
      {
        designSystemPath: designSystem.metadata.designSystemPath,
        exportName: "export-figma-token-studio",
        value: JSON.stringify(exportFigma),
        extension: "json",
      },
      {
        onSuccess: () => {
          toast.success("Success to generate figma export");
          setExportGenerated((val) => val.filter((x) => x !== "figma"));
          queryClient.refetchQueries({
            queryKey: ["design-system", designSystem.metadata.designSystemPath],
          });
        },
      }
    );
  }

  async function handleCssExport({ callback }: { callback?: () => void }) {
    const exportCss = cssExport(designSystem);
    await generateExport(
      {
        designSystemPath: designSystem.metadata.designSystemPath,
        exportName: "export-stylesheet",
        value: exportCss,
        extension: "css",
      },
      {
        onSuccess: () => {
          toast.success("Success to generate css export");
          setExportGenerated((val) => val.filter((x) => x !== "css"));
          callback?.();
          queryClient.refetchQueries({
            queryKey: ["design-system", designSystem.metadata.designSystemPath],
          });
        },
      }
    );
  }

  async function generateExports() {
    if (exportGenerated.includes("css")) {
      await handleCssExport({
        callback: () => {
          if (exportGenerated.includes("figma")) {
            handleExportFigma();
          }
        },
      });
    } else if (exportGenerated.includes("figma")) {
      await handleExportFigma();
    }
    if (exportGenerated.includes("readme")) {
      saveReadme(designSystem, {
        onSuccess: () => {
          toast.success("Success to generate readme export");
          setExportGenerated((val) => val.filter((x) => x !== "readme"));
          queryClient.refetchQueries({
            queryKey: ["design-system", designSystem.metadata.designSystemPath],
          });
        },
      });
    }
  }

  return (
    <Modal.Custom title="Exports" width="600px">
      <Modal.Md width="600px">
        <div className="column gap-6">
          <h6>Existing exports</h6>
          <div className="column gap-6">
            <ExportLine filemetadata={designSystem.metadata.exports.readme} />
            <ExportLine filemetadata={designSystem.metadata.exports.css} />
            <ExportLine
              filemetadata={designSystem.metadata.exports.figmaTokenStudio}
            />
          </div>
          <div className="row justify-end">
            <button className="action-button" onClick={openExportFolder}>
              <MdFolder size={ICON_SIZE_MD} /> Export folder
            </button>
          </div>
          <div className="separator" />
          <h6>Generate exports</h6>
          <div className="column gap-4">
            <ExportItem
              category="css"
              exportGenerated={exportGenerated}
              toggleExport={toggleExport}
              title="CSS Stylesheet"
            />
            <ExportItem
              category="figma"
              exportGenerated={exportGenerated}
              toggleExport={toggleExport}
              title="Figma via token studio"
            />
            <ExportItem
              category="readme"
              exportGenerated={exportGenerated}
              toggleExport={toggleExport}
              title="Readme"
            />
            {(isSavingReadme || isGeneratingExport) && <Loader />}
            <div className="row justify-end gap-2">
              <ButtonPrimary
                disabled={
                  isSavingReadme ||
                  isGeneratingExport ||
                  !exportGenerated.length
                }
                onClick={generateExports}
              >
                <MdDownload size={ICON_SIZE_MD} />
                Generate exports
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </Modal.Md>
    </Modal.Custom>
  );
}

export default ExportModal;
