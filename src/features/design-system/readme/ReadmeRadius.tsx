import { ColorCombinationMapped, DesignSystem } from "../../../domain/DesignSystemDomain";
import { findMainBackground, findMainColorCombination } from "../../../util/DesignSystemUtils";

function ReadmeRadius({ designSystem }: { designSystem: DesignSystem }) {
  const { radius, typography } = designSystem;
  const radiusRectColors: ColorCombinationMapped = findMainColorCombination(designSystem);
  const previewContainerBackground: string = findMainBackground(designSystem);
  const rootFontSize: number = typography.root.fontSize.value; // en pixels

  // Rassemble le radius "default" et les additionals dans un seul tableau
  const radiusItems = [
    { radiusKey: "default", radiusValue: radius.default },
    ...radius.additionalsRadius,
  ];

  // Dimensions SVG
  const svgWidth = 1200;
  const labelColumnWidth = (20 / 100) * svgWidth; // 240px
  const previewColumnWidth = svgWidth - labelColumnWidth; // 960px
  const horizontalPadding = 16; // padding gauche et droite dans la colonne preview
  const paddingTop = 16; // padding en haut de chaque ligne
  const gapBottom = 20; // gap en bas de chaque ligne
  const labelFontSize = 20; // en pixels
  const valueFontSize = 14; // taille de la police pour le texte centré

  // Hauteur fixe pour chaque rectangle de preview (en px)
  const previewRectHeight = 120;

  // Conversion d'une mesure (REM ou PX) en pixels
  const toPx = (measurement: { unit: "REM" | "PX"; value: number }): number => {
    return measurement.unit === "REM" ? measurement.value * rootFontSize : measurement.value;
  };

  // Calcul de la hauteur de contenu (sans gapBottom) : max entre hauteur du rectangle et hauteur du label
  const rowContentHeights = radiusItems.map(() => Math.max(previewRectHeight, labelFontSize));
  // Ajout du gapBottom pour chaque ligne
  const rowHeightsNoPadding = rowContentHeights.map((h) => h + gapBottom);

  // Calcul des offsets verticaux (pour empiler les lignes en incluant paddingTop pour la première ligne)
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
        fill="white"
      />

      {/* Fond uniquement derrière la colonne preview */}
      <rect
        x={labelColumnWidth}
        y={0}
        width={previewColumnWidth}
        height={svgHeight}
        fill={previewContainerBackground}
        rx={4}
        ry={4}
      />

      {radiusItems.map((item, index) => {
        const contentHeight = rowContentHeights[index];
        const yOffset = yOffsets[index];

        // Position Y du haut du rectangle de preview (centré verticalement dans la ligne)
        const rectY = yOffset + (contentHeight - previewRectHeight) / 2;

        // Conversion du radius en pixels
        const radiusPx = toPx(item.radiusValue);

        // Largeur du rectangle de preview = 2/3 de la largeur interne (après padding)
        const availableWidth = previewColumnWidth - 2 * horizontalPadding;
        const rectWidth = (2 / 3) * availableWidth;

        // X pour centrer le rectangle dans la colonne preview
        const rectX = labelColumnWidth + (previewColumnWidth - rectWidth) / 2;

        // Coordonnées du texte centré dans le rectangle
        const textXCenter = rectX + rectWidth / 2;
        const textYCenter = rectY + previewRectHeight / 2;

        return (
          <g key={item.radiusKey} transform={`translate(0, ${yOffset})`}>
            {/* Label du radius, aligné en haut du rectangle de preview */}
            <text
              x={8}
              y={rectY - yOffset}
              dominantBaseline="hanging"
              textAnchor="start"
              fontSize={labelFontSize}
              fontWeight={700}
              fontFamily="Arial"
              fill={"#71717a"}
            >
              radius-{item.radiusKey}
            </text>

            {/* Rectangle de preview avec border-radius, centré horizontalement */}
            <rect
              x={rectX}
              y={rectY - yOffset}
              width={rectWidth}
              height={previewRectHeight}
              fill={radiusRectColors.backgroundColor}
              stroke={radiusRectColors.borderColor}
              rx={radiusPx}
              ry={radiusPx}
            >
              <title>{`${item.radiusKey}: ${item.radiusValue.value}${item.radiusValue.unit}`}</title>
            </rect>

            {/* Texte avec la valeur du radius (en px), centré dans le rectangle */}
            <text
              x={textXCenter}
              y={textYCenter - yOffset}
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize={valueFontSize}
              fontWeight={400}
              fontFamily="Arial"
              fill={radiusRectColors.textColor}
            >
              {`${radiusPx}px`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmeRadius;
