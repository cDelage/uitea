import { MdClose, MdStar, MdStarOutline } from "react-icons/md";
import { getContrastInfo, STAR_ARRAY } from "../../util/PickerUtil";
import { useColorPickerStore } from "./ColorPickerStore";
import InputColorPopover from "./InputColorPopover";
import { ICON_SIZE_SM } from "../../ui/UiConstants";
import { usePopoverContext } from "../../ui/kit/PopoverContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Popover from "../../ui/kit/Popover";

function ColorPickerPopover() {
  const { colors, initColorPickerStore } = useColorPickerStore();
  const contrastInfo = getContrastInfo(colors);
  const { closePopover } = usePopoverContext();
  const { pathname } = useLocation();
  const [currentLoc] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentLoc) {
      closePopover("contrast-checker");
    }
  }, [pathname, closePopover, currentLoc]);

  useEffect(() => {
    if (!colors[0]) {
      initColorPickerStore();
    }
  }, [colors, initColorPickerStore]);

  return (
    <Popover>
      <div className="popover-body">
        <div className="row justify-between align-center">
          <label>Contrast checker</label>
          <button
            className="action-ghost-button"
            style={{
              paddingTop: "2px",
            }}
            onClick={() => closePopover("contrast-checker")}
          >
            <MdClose size={ICON_SIZE_SM} />
          </button>
        </div>
        <div className="row gap-4">
          <InputColorPopover color={colors[0]} index={0} />
          <InputColorPopover color={colors[1]} index={1} />
          <div
            className="row gap-4 justify-between align-center rounded-md shadow-md py-2 px-4 border-box"
            style={{
              backgroundColor: `var(--uidt-palette-${contrastInfo.palette}-100)`,
              color: `var(--uidt-palette-${contrastInfo.palette}-900)`,
            }}
          >
            <div className="row align-center gap-2">
              <h5>{`${contrastInfo.contrast} (${contrastInfo.quality})`}</h5>
            </div>

            <div className="row align-center">
              {STAR_ARRAY.map((star, index) => (
                <div key={star}>
                  {index <= contrastInfo.starCount - 1 ? (
                    <MdStar
                      size={ICON_SIZE_SM}
                      style={{
                        transform: "translateY(2px)",
                      }}
                    />
                  ) : (
                    <MdStarOutline
                      size={ICON_SIZE_SM}
                      style={{
                        transform: "translateY(2px)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default ColorPickerPopover;
