import {
  ColorCombinationCollectionMapped,
  ColorCombinationMapped,
  SemanticColorTokensMapped,
} from "../../../domain/DesignSystemDomain";

function ReadmeSemantic({ semantic }: { semantic: SemanticColorTokensMapped }) {
  const {
    colorCombinationCollections,
    backgroundColor,
    backgroundToken,
    borderColor,
    borderToken,
    textDarkColor,
    textDarkToken,
    textDefaultColor,
    textDefaultToken,
    textLightColor,
    textLightToken,
  } = semantic;

  // base slots
  const baseSlots = [
    {
      key: "textLight",
      label: "Text Light",
      color: textLightColor,
      token: textLightToken,
      tokenName: "base-text-light",
    },
    {
      key: "textDefault",
      label: "Text Default",
      color: textDefaultColor,
      token: textDefaultToken,
      tokenName: "base-text-default",
    },
    {
      key: "textDark",
      label: "Text Dark",
      color: textDarkColor,
      token: textDarkToken,
      tokenName: "base-text-dark",
    },
    {
      key: "border",
      label: "Border",
      color: borderColor,
      token: borderToken,
      tokenName: "base-border",
    },
  ];

  // dimensions globales
  const svgWidth = 1200;
  const borderRadius = 4;
  const squareSize = 60;
  const nameColumnWidth = (20 / 100) * svgWidth; // 20% pour la colonne nom
  const linePadding = 8;
  const previewHorizontalPadding = 8; // padding horizontal pour le preview
  const tokenGap = 8;
  const tokenLineHeight = 24;
  const textInsideFontSize = 20;
  const tokenFontSize = 14;

  // déterminer le nombre max d'états par ligne
  const maxStates = colorCombinationCollections.reduce((max, combo) => {
    const count = ["default", "hover", "active", "focus"].filter(
      (k) => combo[k as keyof ColorCombinationCollectionMapped]
    ).length;
    return Math.max(max, count);
  }, 0);

  const stateSlotWidth = (svgWidth - nameColumnWidth) / maxStates;

  // hauteur d'une rangée : preview + tokens + paddings
  const rowHeight =
    linePadding + // padding top
    squareSize +
    tokenGap +
    3 * tokenLineHeight + // trois lignes de tokens
    linePadding; // padding bottom

  const svgHeight = (colorCombinationCollections.length + 1) * rowHeight;

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* fond */}
      <rect x={0} y={0} width={svgWidth} height={svgHeight} fill="white" />
      <g transform={`translate(0, 0)`}>
        {/* preview base-background */}
        <text
          x={linePadding}
          y={linePadding + squareSize / 2}
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={20}
          fontWeight={700}
          fontFamily="Arial"
          fill="#71717a"
        >
          base
        </text>
        {/* rectangle preview */}
        <rect
          x={nameColumnWidth + previewHorizontalPadding}
          y={linePadding}
          width={stateSlotWidth - 2 * previewHorizontalPadding}
          height={squareSize}
          fill={backgroundColor}
          rx={borderRadius}
          ry={borderRadius}
          stroke="none"
        />
        {/* token info */}
        <text
          x={nameColumnWidth + previewHorizontalPadding}
          y={
            linePadding +
            squareSize +
            tokenGap +
            tokenFontSize
          }
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={tokenFontSize}
          fontWeight={700}
          fontFamily="Arial"
          fill="#3f3f46"
        >
          base-background
        </text>
        <text
          x={nameColumnWidth + previewHorizontalPadding}
          y={
            linePadding +
            squareSize +
            tokenGap * 2 +
            tokenFontSize * 2
          }
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={tokenFontSize}
          fontFamily="Arial"
          fill="#71717a"
        >
          {backgroundToken}
        </text>
      </g>
      <g transform={`translate(0, ${rowHeight})`}>
        <text
          x={linePadding}
          y={linePadding + squareSize / 2}
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={20}
          fontWeight={700}
          fontFamily="Arial"
          fill="#71717a"
        >
          base
        </text>
        {baseSlots.map((slot, i) => {
          const slotX = nameColumnWidth + i * stateSlotWidth;
          const rectX = slotX + previewHorizontalPadding;
          const rectY = linePadding;
          const rectW = stateSlotWidth - 2 * previewHorizontalPadding;

          return (
            <g key={slot.key}>
              {/* preview principal */}
              <rect
                x={rectX}
                y={rectY}
                width={rectW}
                height={squareSize}
                fill={backgroundColor}
                rx={borderRadius}
                ry={borderRadius}
                stroke="none"
              />
              {/* contenu preview */}
              {slot.key !== "border" ? (
                <text
                  x={rectX + rectW / 2}
                  y={rectY + squareSize / 2}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize={textInsideFontSize}
                  fontWeight={700}
                  fontFamily="Arial"
                  fill={slot.color}
                >
                  {slot.label}
                </text>
              ) : (
                /* pour border: 4 mini rectangles avec styles de bordure différents */
                [
                  { dash: undefined },
                  { dash: "4,2" },
                  { dash: "1,2" },
                  { dash: "8,2,2,2" },
                ].map((style, idx) => {
                  const size = squareSize / 2;
                  const cx = rectX + (idx + 0.5) * (rectW / 4);
                  const cy = rectY + squareSize / 2;
                  return (
                    <rect
                      key={idx}
                      x={cx - size / 2}
                      y={cy - size / 2}
                      width={size}
                      height={size}
                      fill="none"
                      stroke={slot.color}
                      strokeWidth={2}
                      strokeDasharray={style.dash}
                    />
                  );
                })
              )}
              {/* token info */}
              <text
                x={rectX}
                y={rectY + squareSize + tokenGap + tokenFontSize}
                dominantBaseline="middle"
                textAnchor="start"
                fontSize={tokenFontSize}
                fontWeight={700}
                fontFamily="Arial"
                fill="#3f3f46"
              >
                {slot.tokenName}
              </text>
              <text
                x={rectX}
                y={rectY + squareSize + tokenGap * 2 + tokenFontSize * 2}
                dominantBaseline="middle"
                textAnchor="start"
                fontSize={tokenFontSize}
                fontFamily="Arial"
                fill="#71717a"
              >
                {slot.token}
              </text>
            </g>
          );
        })}
      </g>
      {colorCombinationCollections.map((combo, i) => {
        const yOffset = (i + 2) * rowHeight;
        // récupérer les états existants
        const states = ["default", "hover", "active", "focus"].filter(
          (k) => combo[k as keyof ColorCombinationCollectionMapped]
        ) as Array<keyof ColorCombinationCollectionMapped>;

        return (
          <g
            key={combo.combinationName ?? i}
            transform={`translate(0, ${yOffset})`}
          >
            {/* nom de la combinaison */}
            <text
              x={linePadding}
              y={linePadding + squareSize / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fontSize={20}
              fontWeight={700}
              fontFamily="Arial"
              fill="#71717a"
            >
              {combo.combinationName}
            </text>

            {states.map((state, j) => {
              const data = combo[state]! as ColorCombinationMapped;
              // slot avec padding horizontal
              const slotX = nameColumnWidth + j * stateSlotWidth;
              const rectX = slotX + previewHorizontalPadding;
              const rectY = linePadding;
              const rectWidth = stateSlotWidth - 2 * previewHorizontalPadding;

              // tokens définis
              const tokenKeys = (
                ["backgroundToken", "borderToken", "textToken"] as const
              ).filter((tokenKey) => data[tokenKey]);

              return (
                <g key={state}>
                  {/* preview avec padding */}
                  <rect
                    x={rectX}
                    y={rectY}
                    width={rectWidth}
                    height={squareSize}
                    fill={data.backgroundColor}
                    stroke={data.borderColor}
                    strokeWidth={2}
                    rx={borderRadius}
                    ry={borderRadius}
                  >
                    <title>{state}</title>
                  </rect>

                  {/* état centré */}
                  <text
                    x={rectX + rectWidth / 2}
                    y={rectY + squareSize / 2}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={textInsideFontSize}
                    fontWeight={700}
                    fontFamily="Arial"
                    fill={data.textColor}
                  >
                    {state}
                  </text>

                  {/* tokens alignés à gauche du slot, catégorie en gras */}
                  {tokenKeys.map((tokenKey, k) => {
                    const rawCategory = tokenKey.replace(/Token$/, "");
                    const tokenValue = data[tokenKey] as string;
                    // positions
                    const categoryX = slotX + previewHorizontalPadding;
                    const valueX =
                      categoryX +
                      rawCategory.length * (tokenFontSize * 0.6) +
                      4;
                    const yPos =
                      rectY +
                      squareSize +
                      tokenGap +
                      (k + 0.5) * tokenLineHeight;
                    return (
                      <g key={tokenKey}>
                        {/* catégorie */}
                        <text
                          x={categoryX}
                          y={yPos}
                          dominantBaseline="middle"
                          textAnchor="start"
                          fontSize={tokenFontSize}
                          fontFamily="Arial"
                          fontWeight={700}
                          fill="#3f3f46"
                        >
                          {rawCategory}:
                        </text>
                        {/* valeur du token */}
                        <text
                          x={valueX}
                          y={yPos}
                          dominantBaseline="middle"
                          textAnchor="start"
                          fontSize={tokenFontSize}
                          fontFamily="Arial"
                          fill="#71717a"
                        >
                          {tokenValue}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default ReadmeSemantic;
