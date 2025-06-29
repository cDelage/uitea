import { useEffect } from "react";
import RecommandationRowComponent from "./RecommandationRowComponent";
import styles from "./TokenCrafter.module.css";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import CursorPortal from "../../ui/kit/CursorPortal";
import { PreviewStyle } from "../design-system/previews/PreviewStyle";
import { getRectSize, ICON_SIZE_MD } from "../../ui/UiConstants";
import Loader from "../../ui/kit/Loader";
import { MdPublish, MdRefresh, MdSyncAlt } from "react-icons/md";
import Popover from "../../ui/kit/Popover";
import SelectPalettePopover from "./SelectPalettePopover";

function Recommandations() {
  const { styleRef, tokenFamilies, designSystem } = useTokenCrafterContext();
  const {
    dragTools,
    setDragTools,
    collection,
    setCollection,
    recommandations,
    isLoadingRecommandation,
    generateRecommandations,
    palettesAndColors,
    customRowRecommandation,
    setCustomRowRecommandation,
    applyBorder,
    setApplyBorder,
  } = useTokenCrafterStore();

  function reverseSelectedPalette() {
    setCustomRowRecommandation({
      ...customRowRecommandation,
      indexPaletteA: customRowRecommandation.indexPaletteB,
      indexPaletteB: customRowRecommandation.indexPaletteA,
    });
  }

  useEffect(() => {
    function handleDragEvent() {
      window.removeEventListener("mouseup", handleDragEvent);
      if (
        dragTools.recommandation !== undefined &&
        dragTools.hoverIndex !== undefined
      ) {
        const combination = dragTools.hoverIndex;
        setCollection({
          ...collection,
          [combination]: {
            ...dragTools.recommandation.combinationTokens,

            border: applyBorder
              ? dragTools.recommandation.combinationTokens.border
              : undefined,
          },
        });
      }
      setDragTools({
        dragIndex: undefined,
        hoverIndex: undefined,
        recommandation: undefined,
        rowDragIndex: undefined,
      });
    }
    if (dragTools.dragIndex !== undefined) {
      window.addEventListener("mouseup", handleDragEvent);
    } else {
      window.removeEventListener("mouseup", handleDragEvent);
    }

    return () => {
      window.removeEventListener("mouseup", handleDragEvent);
    };
  }, [dragTools, setDragTools, collection, setCollection, applyBorder]);

  return (
    <div className={styles.recommandations}>
      <Popover>
        {dragTools.dragIndex !== undefined && (
          <CursorPortal>
            <PreviewStyle $tokenFamilies={tokenFamilies} ref={styleRef} $designSystem={designSystem}>
              <div className="cursor-body column gap-2">
                {dragTools.hoverIndex && (
                  <div className="row gap-2 align-center">
                    <MdPublish size={ICON_SIZE_MD} />
                    <strong>{dragTools.hoverIndex}</strong>
                  </div>
                )}
                <div className="row gap-2 align-center">
                  <div
                    className="palette-color"
                    style={{
                      background: `var(--${dragTools.recommandation?.combinationTokens.background})`,
                      border: `1px solid var(--${dragTools.recommandation?.combinationTokens.border})`,
                      ...getRectSize({ height: "var(--uidt-space-5)" }),
                    }}
                  />
                  <strong>
                    {(dragTools.rowDragIndex ?? 0) + 1}-
                    {dragTools.dragIndex + 1}
                  </strong>
                </div>
              </div>
            </PreviewStyle>
          </CursorPortal>
        )}
        <div className="row justify-between align-center">
          <h3>Recommandations</h3>
          <div className="row gap-4 align-center">
            <div className="row gap-2 align-center">
              <input
                type="checkbox"
                checked={applyBorder}
                onChange={() => setApplyBorder(!applyBorder)}
              />
              <label>Border recommandation</label>
            </div>
            {!isLoadingRecommandation &&
              !recommandations.length &&
              tokenFamilies.length && (
                <button
                  className="action-button"
                  onClick={() => generateRecommandations(designSystem)}
                >
                  <MdRefresh size={ICON_SIZE_MD} />
                  Refresh recommandation
                </button>
              )}
          </div>
        </div>
        <div className="column gap-3">
          {recommandations.map((line, rowIndex) => (
            <RecommandationRowComponent
              key={line.label}
              recommandationRow={line}
              rowIndex={rowIndex}
            />
          ))}
          {isLoadingRecommandation && <Loader />}
          {palettesAndColors.length !== 0 && (
            <div className="column gap-8">
              <div className="column gap-6">
                <h3>Mix palettes & colors</h3>
                <div className="row gap-4 align-center">
                  <SelectPalettePopover target="indexPaletteA" />
                  <button
                    className="action-ghost-button gap-0"
                    onClick={reverseSelectedPalette}
                  >
                    <MdSyncAlt />
                  </button>
                  <SelectPalettePopover target="indexPaletteB" />
                </div>
              </div>
              {customRowRecommandation.recommandationRow && (
                <RecommandationRowComponent
                  recommandationRow={customRowRecommandation.recommandationRow}
                  rowIndex={recommandations.length}
                />
              )}
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}

export default Recommandations;
