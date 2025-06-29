import {
  ColorCombinationMapped,
  DesignSystem,
} from "../../../domain/DesignSystemDomain";
import {
  findMainBackground,
  findMainColorCombination,
} from "../../../util/DesignSystemUtils";
import ShadowSvg from "./ShadowSvg";

function ReadmeShadows({ designSystem }: { designSystem: DesignSystem }) {
  const { shadows } = designSystem;
  const radiusRectColors: ColorCombinationMapped =
    findMainColorCombination(designSystem);
  const previewContainerBackground: string = findMainBackground(designSystem);

  // Dimensions SVG
  const svgWidth = 1200;
  const labelColumnWidth = (20 / 100) * svgWidth; // 240px
  const previewColumnWidth = svgWidth - labelColumnWidth; // 960px
  const horizontalPadding = 16; // padding gauche et droite dans la colonne preview
  const paddingTop = 50; // padding en haut de chaque ligne
  const gapBottom = 100; // gap en bas de chaque ligne
  const labelFontSize = 20; // en pixels
  const valueFontSize = 14; // taille de la police pour le texte centré

  // Hauteur fixe pour chaque rectangle de preview (en px)
  const previewRectHeight = 120;

  // Calcul de la hauteur de contenu (sans gapBottom) : max entre hauteur du rectangle et hauteur du label
  const rowContentHeights = shadows.map(() =>
    Math.max(previewRectHeight, labelFontSize)
  );
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
  const svgHeight =
    lastIndex >= 0 ? yOffsets[lastIndex] + rowHeightsNoPadding[lastIndex] : 0;

  return (
    <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
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

      {shadows.map((item, index) => {
        const contentHeight = rowContentHeights[index];
        const yOffset = yOffsets[index];
        
        // Position Y du haut du rectangle de preview (centré verticalement dans la ligne)
        const rectY = yOffset + (contentHeight - previewRectHeight) / 2;

        // Largeur du rectangle de preview = 2/3 de la largeur interne (après padding)
        const availableWidth = previewColumnWidth - 2 * horizontalPadding;
        const rectWidth = (2 / 3) * availableWidth;

        // X pour centrer le rectangle dans la colonne preview
        const rectX = labelColumnWidth + (previewColumnWidth - rectWidth) / 2;

        // Coordonnées du texte centré dans le rectangle
        const textXCenter = rectX + rectWidth / 2;
        const textYCenter = rectY + previewRectHeight / 2;

        return (
          <g key={item.shadowName} transform={`translate(0, ${yOffset})`}>
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
              shadow-{item.shadowName}
            </text>

            <ShadowSvg shadows={item} designSystem={designSystem}/>
            <rect
              x={rectX}
              y={rectY - yOffset}
              width={rectWidth}
              height={previewRectHeight}
              fill={radiusRectColors.backgroundColor}
              stroke={radiusRectColors.borderColor}
              filter={`url(#${item.shadowName})`}
            >
              <title>{item.shadowName}</title>
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
              {item.shadowName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmeShadows;
