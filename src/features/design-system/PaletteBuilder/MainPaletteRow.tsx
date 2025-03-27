import { MdVpnKey } from "react-icons/md";
import Popover from "../../../ui/kit/Popover";
import {
  getContrastColor,
  usePaletteBuilderTwoStore,
} from "../../../util/PaletteBuilderTwoStore";
import MainPaletteColorPicker from "./MainPaletteColorPicker";
import styles from "./PaletteBuilderTwo.module.css";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import MainPaletteKeyColorPicker from "./MainPaletteKeyColorPicker";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../../util/DraggableContext";
import { MouseEvent } from "react";
import Cursor from "../../../ui/kit/Cursor";

function MainPaletteRow() {
  const { mainPalette, setMainPaletteColor, minSaturation, maxSaturation, getColorPropositions } =
    usePaletteBuilderTwoStore();

  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex !== undefined &&
        hoverIndex !== undefined &&
        dragIndex !== hoverIndex &&
        hoverIndex !== "remove"
      ) {
        const draggedColor = mainPalette.tints[dragIndex].color;
        const proposition = getColorPropositions(draggedColor.hex, minSaturation, maxSaturation);
        setMainPaletteColor(
          {
            ...mainPalette,
            tints: mainPalette.tints.map((tint, index) => {
              if (index === dragIndex) {
                return {
                  ...tint,
                  isFixed: false,
                };
              } else if (index === hoverIndex) {
                return {
                  ...tint,
                  color: draggedColor,
                  isFixed: true,
                };
              } else {
                return tint;
              }
            }),
          },
          proposition.minSaturation,
          proposition.maxSaturation
        );
      }
    }
  );

  function handleDragKeyColor(e: MouseEvent<HTMLDivElement>, index: number) {
    e.stopPropagation();
    draggableTools.setDragIndex(index);
  }

  function handleHoverColor(index: number) {
    if (draggableTools.dragIndex !== undefined) {
      draggableTools.setHoverIndex(index);
    }
  }

  return (
    <tr className={styles.paletteRow}>
      <td className={styles.columnPalette}>
        <Popover>
          <Popover.Toggle id="main-picker">
            <div className={styles.palettePickerButton}>
              <div
                className={styles.paletteColor}
                style={{
                  background: mainPalette.mainColorHex,
                }}
              ></div>
              {mainPalette.name}
            </div>
          </Popover.Toggle>
          <Popover.Body id="main-picker" zIndex={100}>
            <MainPaletteColorPicker />
          </Popover.Body>
        </Popover>
      </td>
      {mainPalette.tints.map((tint, index) => (
        <Popover key={tint.name}>
          <Popover.Toggle id="key-picker">
            <td
              className={styles.columnPrimaryTintPreview}
              style={{
                background: tint.color.hex,
              }}
              data-draghover={draggableTools.hoverIndex === index}
              onMouseEnter={() => handleHoverColor(index)}
            >
              {draggableTools.hoverIndex === index && (
                <Cursor
                  position={{
                    top: 0,
                    left: -1,
                    transform: "translate(-50%,-50%)",
                  }}
                  zIndex={60}
                  theme="add"
                ></Cursor>
              )}
              {tint.isFixed && (
                <div
                  className={styles.keyColor}
                  onMouseDown={(e) => handleDragKeyColor(e, index)}
                  onDragStart={(e) => e.preventDefault()}
                  data-drag={draggableTools.dragIndex === index}
                >
                  <MdVpnKey
                    color={
                      draggableTools.dragIndex !== index
                        ? getContrastColor(tint.color.hex)
                        : undefined
                    }
                    size={ICON_SIZE_MD}
                    className="rotate-key"
                  />
                </div>
              )}
            </td>
          </Popover.Toggle>
          <Popover.Body zIndex={50} id="key-picker">
            <MainPaletteKeyColorPicker tintIndex={index} />
          </Popover.Body>
        </Popover>
      ))}
      <td className={styles.columnOptions}></td>
    </tr>
  );
}

export default MainPaletteRow;
