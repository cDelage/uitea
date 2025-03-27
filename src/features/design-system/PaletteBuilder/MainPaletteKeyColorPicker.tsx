import { useState } from "react";
import {
  getColorOkhsl,
  usePaletteBuilderTwoStore,
} from "../../../util/PaletteBuilderTwoStore";
import ColorPicker from "../ColorPicker";
import { usePopoverContext } from "../../../ui/kit/PopoverContext";
import { ButtonAlert, ButtonTertiary } from "../../../ui/kit/Buttons";

function MainPaletteKeyColorPicker({ tintIndex }: { tintIndex: number }) {
  const {
    mainPalette,
    setMainPaletteColor,
    getColorPropositions,
    minSaturation,
    maxSaturation,
  } = usePaletteBuilderTwoStore();
  const tint = mainPalette.tints[tintIndex];
  const [tmpColor, setTmpColor] = useState(tint.color.hex);
  const { closePopover } = usePopoverContext();
  const [initialColor] = useState(tint);
  const [originalSaturation] = useState({ minSaturation, maxSaturation });

  function handleSetTmpColor(color: string) {
    setTmpColor(color);
    const proposition = getColorPropositions(
      color,
      originalSaturation.minSaturation,
      originalSaturation.maxSaturation
    );
    setMainPaletteColor(
      {
        ...mainPalette,
        mainColorHex: color,
        tints: mainPalette.tints.map((tint, index) => {
          const isUpdate = index === tintIndex;
          return {
            ...tint,
            name: isUpdate ? proposition.colorName : tint.name,
            color: isUpdate ? getColorOkhsl(color) : tint.color,
            isFixed: isUpdate ? true : tint.isFixed,
          };
        }),
      },
      proposition.minSaturation,
      proposition.maxSaturation
    );
  }

  function handleCancel() {
    setMainPaletteColor(
      {
        ...mainPalette,
        tints: mainPalette.tints.map((tint, index) => {
          return index === tintIndex ? initialColor : tint;
        }),
      },
      originalSaturation.minSaturation,
      originalSaturation.maxSaturation
    );
    closePopover();
  }

  function handleRemoveKeyColor() {
    setMainPaletteColor(
      {
        ...mainPalette,
        tints: mainPalette.tints.map((tint, index) => {
          return index === tintIndex
            ? { ...initialColor, isFixed: false }
            : tint;
        }),
      },
      originalSaturation.minSaturation,
      originalSaturation.maxSaturation
    );
    closePopover();
  }

  return (
    <div data-disableoutside="true" className="column gap-2">
      <ColorPicker
        color={tmpColor}
        setColor={handleSetTmpColor}
        disableAlpha={true}
      />
      <div className="popover-body">
        <div className="row justify-end gap-2">
          <ButtonTertiary onClick={handleCancel}>Cancel</ButtonTertiary>
          {tint.isFixed && (
            <>
              <ButtonAlert onClick={handleRemoveKeyColor}>
                Remove key color
              </ButtonAlert>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPaletteKeyColorPicker;
