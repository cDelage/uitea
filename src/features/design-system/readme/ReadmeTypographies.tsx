import {
  Typographies,
  TypographyScale,
  Measurement,
  DesignSystem,
} from "../../../domain/DesignSystemDomain";

function ReadmeTypographies({ designSystem }: { designSystem: DesignSystem }) {
  const { typography: typographies, fonts } = designSystem;

  // Largeur totale du SVG et largeur de la colonne « label »
  const svgWidth = 1200;
  const labelColumnWidth = svgWidth * 0.2;
  const contentWidth = svgWidth - labelColumnWidth;

  // Constantes réutilisables
  const columnGap = 16;
  // Espace entre la ligne de texte et la zone attributs
  const GAP_TO_ATTR = 20;
  // Hauteur du bloc attributs (22px d’écart + 14px de texte)
  const ATTRIBUTE_BLOCK_HEIGHT = 36;
  // Padding bas entre la zone attributs et la suivante
  const BOTTOM_PADDING = 32;
  // On regroupe : GAP_TO_ATTR + ATTRIBUTE_BLOCK_HEIGHT + BOTTOM_PADDING
  const FIXED_ROW_GUTTER = GAP_TO_ATTR + ATTRIBUTE_BLOCK_HEIGHT + BOTTOM_PADDING;

  const loremText = "Lorem ipsum dolor sit amet";

  // Conversion d’une Measurement en pixels
  const toPx = ({ unit, value }: Measurement): number => {
    return unit === "PX" ? value : value * 16;
  };

  // Construction du tableau des lignes
  type KeyOfTypo = Exclude<keyof Typographies, "customScales">;
  const standardKeys: KeyOfTypo[] = [
    "root",
    "paragraph",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "small",
    "strong",
  ];
  const rows: { label: string; scale: TypographyScale }[] = [];

  standardKeys.forEach((key) => {
    if (typographies[key]) {
      rows.push({
        label: key,
        scale: typographies[key] as TypographyScale,
      });
    }
  });

  if (typographies.customScales && typographies.customScales.length > 0) {
    typographies.customScales.forEach((custom) => {
      rows.push({
        label: custom.scaleName,
        scale: custom.scale as TypographyScale,
      });
    });
  }

  // Hauteur d’une ligne = line-height (en px) + FIXED_ROW_GUTTER
  const getRowHeight = (scale: TypographyScale) => {
    return toPx(scale.lineHeight) + FIXED_ROW_GUTTER;
  };

  // Somme de toutes les hauteurs
  const svgHeight = rows.reduce(
    (sum, { scale }) => sum + getRowHeight(scale),
    0
  );

  return (
    <svg width={svgWidth} height={svgHeight}>
      <rect x={0} y={0} width={svgWidth} height={svgHeight} fill="white" />

      {rows.map(({ label, scale }, i) => {
        // Décalage vertical à partir des lignes précédentes
        const prevRowsHeight = rows
          .slice(0, i)
          .reduce((sum, r) => sum + getRowHeight(r.scale), 0);

        const lineHeightPx = toPx(scale.lineHeight);
        // Zone de texte de chaque ligne démarre en y=0 dans le groupe

        // Largeur d’une colonne d’attributs (4 colonnes, 3 espaces)
        const attrColumnWidth = (contentWidth - 3 * columnGap) / 4;

        const attributes: { name: string; value: string }[] = [
          {
            name: "font-size",
            value: `${scale.fontSize.value}${scale.fontSize.unit.toLowerCase()}`,
          },
          {
            name: "line-height",
            value: `${scale.lineHeight.value}${scale.lineHeight.unit.toLowerCase()}`,
          },
          {
            name: "font-weight",
            value: `${scale.fontWeight}`,
          },
          {
            name: "font",
            value: scale.font || fonts.default,
          },
        ];

        return (
          <g key={label} transform={`translate(0, ${prevRowsHeight})`}>
            {/* Label */}
            <text
              x={8}
              y={lineHeightPx / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={20}
              fontWeight={700}
              fontFamily="Arial"
              fill="#71717a"
            >
              {label}
            </text>

            {/* Lignes repères de la line-height */}
            <line
              x1={labelColumnWidth}
              y1={0}
              x2={svgWidth}
              y2={0}
              stroke="#93c5fd"
              strokeWidth={1}
            />
            <line
              x1={labelColumnWidth}
              y1={lineHeightPx}
              x2={svgWidth}
              y2={lineHeightPx}
              stroke="#93c5fd"
              strokeWidth={1}
            />

            {/* Texte de démonstration */}
            <text
              x={labelColumnWidth + 8}
              y={lineHeightPx / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={
                scale.fontSize.unit === "PX"
                  ? scale.fontSize.value
                  : scale.fontSize.value * 16
              }
              fontWeight={scale.fontWeight}
              fontFamily={scale.font || fonts.default}
              fill={scale.color || "#3f3f46"}
            >
              {loremText}
            </text>

            {/* Zone des attributs */}
            {attributes.map((attr, idx) => {
              const colX =
                labelColumnWidth + idx * (attrColumnWidth + columnGap);

              return (
                <g key={attr.name}>
                  {/* Nom de l’attribut */}
                  <text
                    x={colX}
                    y={lineHeightPx + GAP_TO_ATTR}
                    dominantBaseline="hanging"
                    textAnchor="start"
                    fontSize={16}
                    fontWeight={600}
                    fontFamily="Arial"
                    fill="#3f3f46"
                  >
                    {attr.name}
                  </text>
                  {/* Valeur de l’attribut */}
                  <text
                    x={colX}
                    y={lineHeightPx + GAP_TO_ATTR + 22}
                    dominantBaseline="hanging"
                    textAnchor="start"
                    fontSize={14}
                    fontWeight={400}
                    fontFamily="Arial"
                    fill="#6b7280"
                  >
                    {attr.value}
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

export default ReadmeTypographies;
