import { Fonts } from "../../../domain/DesignSystemDomain";

function ReadmeFonts({ fonts }: { fonts: Fonts }) {
  // Rassemble la font par défaut et les fonts additionnelles dans un même tableau
  const allFonts = [
    { fontName: "default", value: fonts.default },
    ...fonts.additionals.map((f) => ({ fontName: f.fontName, value: f.value })),
  ];

  // Dimensions globales du SVG
  const svgWidth = 1200; // Largeur totale
  const linePadding = 8; // Padding vertical pour chaque ligne
  const lineHeightPadding = 20; // Padding vertical pour chaque ligne
  const labelFontSize = 20; // Taille de la font pour le label (colonne de gauche)
  const sampleFontSize = 40; // Taille de la font pour l’aperçu (colonne de droite)

  // Hauteur d’une ligne = hauteur du texte d’aperçu + 2 * padding
  const rowHeight = sampleFontSize + 2 * lineHeightPadding;
  const svgHeight = allFonts.length * rowHeight;

  // Largeur réservée à la colonne des labels (20% de la largeur totale)
  const labelColumnWidth = (20 / 100) * svgWidth;

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* Fond blanc */}
      <rect x={0} y={0} width={svgWidth} height={svgHeight} fill="white" />

      {allFonts.map((font, i) => {
        // Décalage vertical pour cette ligne
        const yOffset = i * rowHeight;
        // Position verticale du texte (baseline) dans la ligne
        const textBaseline = linePadding + sampleFontSize;
        const labelBaseline = linePadding + (labelFontSize + ((sampleFontSize - labelFontSize) / 2))

        return (
          <g key={font.fontName} transform={`translate(0, ${yOffset})`}>
            {/* Colonne de gauche : label (“default” ou nom de la font) en Arial */}
            <text
              x={linePadding}
              y={labelBaseline}
              fontSize={labelFontSize}
              fontFamily="Arial"
              fill="#71717a"
              dominantBaseline="alphabetic"
              textAnchor="start"
              fontWeight={700}
            >
              {font.fontName}
            </text>

            {/* Colonne de droite : aperçu du nom de la font en utilisant la font elle-même */}
            <text
              x={labelColumnWidth}
              y={textBaseline}
              fontSize={sampleFontSize}
              fontFamily={font.value}
              fill="#000"
              dominantBaseline="alphabetic"
              textAnchor="start"
            >
              {font.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmeFonts;
