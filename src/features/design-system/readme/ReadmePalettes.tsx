import { DesignSystem } from "../../../domain/DesignSystemDomain";

function ReadmePalette({ designSystem }: { designSystem: DesignSystem }) {
  const { palettes } = designSystem;
  const svgWidth = 1200; // largeur fixe en pixels
  const borderRadius = 4;
  const lineHeight = 60;
  const textLineHeight = 14;
  const linePadding = 8;
  const tintPadding = 4; // padding horizontal autour de chaque teinte
  const tintGap = 8; // gap vertical entre le rect et les lignes de texte

  // hauteur d'une ligne incluant preview + 2 textes + padding + gaps
  const rowHeight =
    lineHeight + 2 * textLineHeight + 3 * linePadding + 2 * tintGap;
  const svgHeight = palettes.length * rowHeight;

  // calcul des largeurs fixes en pixels
  const paletteNameWidth = (20 / 100) * svgWidth;
  const maxTints = palettes.reduce((max, p) => Math.max(max, p.tints.length), 0);
  const tintSlotWidth = ((100 - 20) / 100) * svgWidth / maxTints;

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* Fond blanc derrière le contenu */}
      <rect
        x="0"
        y="0"
        width={svgWidth}
        height={svgHeight}
        fill="white"
      />

      {palettes.map((palette, i) => {
        const yOffset = i * rowHeight;
        return (
          <g key={palette.paletteName} transform={`translate(0, ${yOffset})`}>
            {/* Nom de la palette aligné verticalement au preview */}
            <text
              x={linePadding}
              y={linePadding + lineHeight / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={20}
              fontWeight={700}
              fontFamily="Arial"
              fill="#71717a"
            >
              {palette.paletteName}
            </text>

            {/* Preview + label + code couleur */}
            {palette.tints.map((tint, j) => {
              const rectX =
                paletteNameWidth + j * tintSlotWidth + tintPadding;
              const rectW = tintSlotWidth - 2 * tintPadding;

              return (
                <g key={tint.label}>
                  <rect
                    x={rectX}
                    y={linePadding}
                    width={rectW}
                    height={lineHeight}
                    fill={tint.color}
                    rx={borderRadius}
                    ry={borderRadius}
                  >
                    <title>{tint.label}</title>
                  </rect>
                  {/* Label aligné exactement avec le rect */}
                  <text
                    x={rectX}
                    y={linePadding + lineHeight + tintGap + textLineHeight / 2}
                    dominantBaseline="middle"
                    textAnchor="start"
                    fontSize={16}
                    fontWeight={700}
                    fontFamily="Arial"
                    fill="#3f3f46"
                  >
                    {tint.label}
                  </text>
                  {/* Code couleur aligné avec le rect */}
                  <text
                    x={rectX}
                    y={
                      linePadding +
                      lineHeight +
                      tintGap +
                      textLineHeight +
                      tintGap +
                      textLineHeight / 2
                    }
                    dominantBaseline="middle"
                    textAnchor="start"
                    fontSize={14}
                    fill="#71717a"
                  >
                    {tint.color}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmePalette;
