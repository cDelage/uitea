import { ButtonPrimary } from "../../../ui/kit/Buttons";
import Modal from "../../../ui/kit/Modal";
import { cssExport, generateTokenStudioFile } from "../../../util/Export";
import { useDesignSystemContext } from "../DesignSystemContext";
import { useGenerateExport } from "../DesignSystemQueries";

function ExportModal() {
  const { designSystem } = useDesignSystemContext();
  const { generateExport } = useGenerateExport();

  function handleExportFigma() {
    const exportFigma = generateTokenStudioFile(designSystem);
    generateExport({
      designSystemPath: designSystem.metadata.designSystemPath,
      exportName: "figma-token-studio",
      value: JSON.stringify(exportFigma),
      extension: "json",
    });
  }

  function handleCssExport() {
    const exportCss = cssExport(designSystem);
    generateExport({
      designSystemPath: designSystem.metadata.designSystemPath,
      exportName: `css-export-${designSystem.metadata.designSystemName}`,
      value: exportCss,
      extension: "css",
    });
  }

  return (
    <Modal.Custom title="Exports">
      <Modal.Md>
        <div className="row justify-end">
          <div className="column gap-3">
            <ButtonPrimary onClick={handleExportFigma}>
              Export figma (via token studio)
            </ButtonPrimary>
            <ButtonPrimary onClick={handleCssExport}>Export css</ButtonPrimary>
          </div>
        </div>
      </Modal.Md>
    </Modal.Custom>
  );
}

export default ExportModal;
