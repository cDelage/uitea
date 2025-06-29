import { FileMetadata } from "../../../domain/DesignSystemDomain";

function ExportLine({ filemetadata }: { filemetadata?: FileMetadata }) {
  if (!filemetadata) return null;
  return (
    <div className="row w-full justify-between">
      <div className="column gap-2">
        <strong className="text-color-dark">{filemetadata.filename}</strong>
        <div className="text-color-light">
          {new Date(filemetadata.updateDate).toLocaleDateString()} -{" "}
          {new Date(filemetadata.updateDate).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default ExportLine;
