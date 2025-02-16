import { TypographyScale } from "../../domain/DesignSystemDomain";
import { useDesignSystemContext } from "./DesignSystemContext";

function TypographyPreview({
  typographyScale,
  keyScale,
}: {
  typographyScale: TypographyScale;
  keyScale: string;
}) {
  const {
    designSystem: { fonts },
  } = useDesignSystemContext();
  return (
    <div style={{ ...typographyScale, fontFamily: fonts.default }}>
      {keyScale} - Lorem ipsum dolor sit amet
    </div>
  );
}

export default TypographyPreview;
