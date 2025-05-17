import { TypographyScale } from "../../../domain/DesignSystemDomain";
import { getTypoCssProperties } from "../../../util/DesignSystemUtils";

function TypographyPreview({
  typographyScale,
  keyScale,
}: {
  typographyScale: TypographyScale;
  keyScale: string;
}) {
  return (
    <div style={{ ...getTypoCssProperties(typographyScale) }}>
      {keyScale} - Lorem ipsum dolor sit amet
    </div>
  );
}

export default TypographyPreview;
