import { useEffect, useState } from "react";
import ColorPicker from "../ColorPicker";
import {
  getColorOkhsl,
  PaletteBuilder,
  PASTE_COLOR_MODE,
  usePaletteBuilderTwoStore,
} from "../../../util/PaletteBuilderTwoStore";
import FormComponent from "../../../ui/kit/FormComponent";
import { ButtonPrimary, ButtonTertiary } from "../../../ui/kit/Buttons";
import Popover from "../../../ui/kit/Popover";
import { usePopoverContext } from "../../../ui/kit/PopoverContext";

function MainPaletteColorPicker() {
  const {
    mainPalette,
    setMainPaletteColor,
    getColorPropositions,
    minSaturation,
    maxSaturation,
  } = usePaletteBuilderTwoStore();
  const [initialPalette] = useState<PaletteBuilder>(mainPalette);
  const [originalSaturation] = useState({ minSaturation, maxSaturation });
  const [tmpColor, setTmpColor] = useState(mainPalette.mainColorHex);
  const [recommandedIndex, setRecommandedIndex] = useState<undefined | number>(
    undefined
  );
  const [selectedTint, setSelectedTint] = useState(mainPalette.tints[0].name);
  const [pasteColorMode, setPasteColorMode] =
    useState<PASTE_COLOR_MODE>("HUE_BASED");

  const [pasteModeChange, setPasteModeChange] = useState(false);

  const { closePopover } = usePopoverContext();

  function handleCancel() {
    setMainPaletteColor(
      initialPalette,
      originalSaturation.minSaturation,
      originalSaturation.maxSaturation
    );
    closePopover();
  }

  useEffect(() => {
    return () => {
      setPasteModeChange(true);
    };
  }, [selectedTint, pasteColorMode]);

  useEffect(() => {
    if (mainPalette.mainColorHex !== tmpColor || pasteModeChange) {
      const colorProposition = getColorPropositions(
        tmpColor,
        originalSaturation.minSaturation,
        originalSaturation.maxSaturation
      );
      setRecommandedIndex(colorProposition.fixedPosition);
      if (!pasteModeChange) {
        setSelectedTint(mainPalette.tints[colorProposition.fixedPosition].name);
      }
      setMainPaletteColor(
        {
          ...initialPalette,
          name: colorProposition.colorName,
          mainColorHex: tmpColor,
          tints: initialPalette.tints.map((tint) => {
            const isPasteColor =
              pasteColorMode === "FIX_COLOR" && selectedTint === tint.name;
            return {
              ...tint,
              color: isPasteColor ? getColorOkhsl(tmpColor) : tint.color,
              isFixed: isPasteColor || tint.isFixed,
            };
          }),
        },
        colorProposition.minSaturation,
        colorProposition.maxSaturation
      );
      setPasteModeChange(false);
    }
  }, [
    getColorPropositions,
    initialPalette,
    setMainPaletteColor,
    tmpColor,
    mainPalette,
    pasteModeChange,
    pasteColorMode,
    selectedTint,
    setPasteModeChange,
    originalSaturation,
  ]);

  return (
    <div data-disableoutside="true" className="column gap-2">
      <ColorPicker
        color={tmpColor}
        setColor={setTmpColor}
        disableAlpha={true}
      />
      <div className="popover-body">
        <FormComponent label="Color application mode">
          <div
            className="row align-center cursor-pointer select-none"
            onClick={() => setPasteColorMode("HUE_BASED")}
          >
            <input
              type="radio"
              checked={pasteColorMode === "HUE_BASED"}
              onChange={() => setPasteColorMode("HUE_BASED")}
            />
            Hue based
          </div>
          <div className="row">
            <div
              className="row align-center cursor-pointer select-none"
              onClick={() => setPasteColorMode("FIX_COLOR")}
            >
              <input
                type="radio"
                checked={pasteColorMode === "FIX_COLOR"}
                onChange={() => setPasteColorMode("FIX_COLOR")}
              />
              Paste the color in position
            </div>
          </div>
          <div className="row flex-1">
            <select
              className="w-full"
              value={selectedTint}
              disabled={pasteColorMode === "HUE_BASED"}
              onChange={(e) => setSelectedTint(e.target.value)}
            >
              {mainPalette.tints.map((tint, index) => (
                <option key={tint.name} value={tint.name}>
                  {tint.name}
                  {recommandedIndex !== undefined &&
                    recommandedIndex === index && <>{" (recommanded)"}</>}
                </option>
              ))}
            </select>
          </div>
        </FormComponent>
        <div className="row align-center justify-end gap-2">
          <ButtonTertiary onClick={handleCancel}>Cancel</ButtonTertiary>
          <Popover.Close>
            <ButtonPrimary>Validate</ButtonPrimary>
          </Popover.Close>
        </div>
      </div>
    </div>
  );
}

export default MainPaletteColorPicker;
