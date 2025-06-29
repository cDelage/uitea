import { EXPORT_CATEGORY } from "../../../domain/DesignSystemDomain";

function ExportItem({
  category,
  exportGenerated,
  toggleExport,
  title,
  updateDate
}: {
  category: EXPORT_CATEGORY;
  exportGenerated: EXPORT_CATEGORY[];
  toggleExport: (category: EXPORT_CATEGORY) => void;
  title: string;
  updateDate?: string;
}) {
  return (
    <div className="column gap-2">
      <div className="row gap-2 align-center">
        <input
          type="checkbox"
          checked={exportGenerated.includes(category)}
          onChange={() => toggleExport(category)}
        />
        <strong>{title}</strong><div className="text-color-light">{updateDate}</div>
      </div>
    </div>
  );
}

export default ExportItem;
