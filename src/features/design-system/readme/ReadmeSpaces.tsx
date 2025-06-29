import { ColorCombinationMapped, DesignSystem } from "../../../domain/DesignSystemDomain";
import { findMainBackground, findMainColorCombination } from "../../../util/DesignSystemUtils";

function ReadmeSpaces({ designSystem }: { designSystem: DesignSystem }) {
  const { spaces, typography } = designSystem;
  const spaceRectColors: ColorCombinationMapped = findMainColorCombination(designSystem);
  const spacesContainerBackground: string = findMainBackground(designSystem);
  const rootFontSize: number = typography.root.fontSize.value; // en pixels
  
  // Dimensions SVG
  const svgWidth = 1200;
  const labelColumnWidth = (20 / 100) * svgWidth;  // 240px
  const previewColumnWidth = svgWidth - labelColumnWidth; // 960px
  const horizontalPadding = 16; // padding gauche et droite dans la colonne preview
  const paddingTop = 8; // padding au-dessus de chaque ligne
  const gapBottom = 20; // gap en bas de chaque ligne
  const labelFontSize = 20; // en pixels
  const previewFontSize = 14; // en pixels

  // Conversion de chaque espace en hauteur (en pixels)
  const heightsPx = spaces.map((space) => {
    const { unit, value } = space.spaceValue;
    return unit === "REM" ? value * rootFontSize : value;
  });

  // Calcul de la hauteur de contenu (sans padding mais avec gapBottom) : max entre hauteur du rectangle et hauteur du label, puis + gapBottom
  const rowHeightsNoPadding = heightsPx.map((h) => Math.max(h, labelFontSize) + gapBottom);

  // Calcul des offsets verticaux (pour empiler les lignes en incluant paddingTop en haut)
  const yOffsets: number[] = [];
  rowHeightsNoPadding.forEach((_, i) => {
    if (i === 0) {
      yOffsets.push(paddingTop);
    } else {
      yOffsets.push(yOffsets[i - 1] + rowHeightsNoPadding[i - 1]);
    }
  });

  // Hauteur totale du SVG = yOffset de la dernière ligne + sa hauteur
  const lastIndex = rowHeightsNoPadding.length - 1;
  const svgHeight = lastIndex >= 0 ? yOffsets[lastIndex] + rowHeightsNoPadding[lastIndex] : 0;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <rect
        x="0"
        y="0"
        width={svgWidth}
        height={svgHeight}
        fill="#ffffff"
      />

      {/* Fond uniquement derrière la colonne preview */}
      <rect
        x={labelColumnWidth}
        y={0}
        width={previewColumnWidth}
        height={svgHeight}
        fill={spacesContainerBackground}
        rx={4}
        ry={4}
      />

      {spaces.map((space, index) => {
        const heightPx = heightsPx[index];
        const contentHeight = Math.max(heightPx, labelFontSize);
        const yOffset = yOffsets[index];

        // Position Y du haut du rectangle de preview (après paddingTop pour la première ligne ou cumulative)
        const rectY = yOffset + (contentHeight - heightPx) / 2;

        // Valeur du texte à afficher au centre du preview
        const textValue = `${space.spaceValue.value}${space.spaceValue.unit.toLowerCase()}`;
        // Estimation de la largeur du texte = nombre de caractères * fontSize * facteur approximatif
        const textWidth = textValue.length * previewFontSize * 0.6;
        const textHeight = previewFontSize + 4;
        // Position centrée du texte dans la zone preview
        const textXCenter = labelColumnWidth + horizontalPadding + (previewColumnWidth - 2 * horizontalPadding) / 2;
        const textYCenter = rectY + heightPx / 2;

        return (
          <g key={space.spaceKey} transform={`translate(0, ${yOffset})`}>
            {/* Label de l'espace, aligné en haut du rectangle de preview */}
            <text
              x={8}
              y={rectY - yOffset}  // yOffset est déjà appliqué via le <g>
              dominantBaseline="hanging"
              textAnchor="start"
              fontSize={labelFontSize}
              fontWeight={700}
              fontFamily="Arial"
              fill={"#71717a"}
            >
              space-{space.spaceKey}
            </text>

            {/* Rectangle de preview */}
            <rect
              x={labelColumnWidth + horizontalPadding}
              y={rectY - yOffset}
              width={previewColumnWidth - 2 * horizontalPadding}
              height={heightPx}
              fill={spaceRectColors.backgroundColor}
              stroke={spaceRectColors.borderColor}
            >
              <title>
                {`${space.spaceKey}: ${space.spaceValue.value}${space.spaceValue.unit}`}
              </title>
            </rect>

            {/* Rectangle derrière le texte, ajusté à la taille du texte */}
            <rect
              x={textXCenter - textWidth / 2}
              y={textYCenter - textHeight / 2 - yOffset}
              width={textWidth}
              height={textHeight}
              fill={spaceRectColors.backgroundColor}
            />

            {/* Texte avec la valeur de l'espacement, centré */}
            <text
              x={textXCenter}
              y={textYCenter - yOffset}
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize={previewFontSize}
              fontWeight={400}
              fontFamily="Arial"
              fill={spaceRectColors.textColor}
            >
              {textValue}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmeSpaces;