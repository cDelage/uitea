import {
  MdAdd,
  MdBookmark,
  MdClose,
  MdDelete,
  MdMoreHoriz,
} from "react-icons/md";
import { getRectSize, ICON_SIZE_MD } from "../../ui/UiConstants";
import styles from "./ColorPicker.module.css";
import { Sample } from "../../domain/ColorPickerDomain";
import { useForm } from "react-hook-form";
import { useColorPickerStore } from "./ColorPickerStore";
import ColorIO from "colorjs.io";
import Popover from "../../ui/kit/Popover";
import {
  RemovableIndex,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { moveItem } from "../../util/ArrayMove";

function ColorSample({ sample, index }: { sample: Sample; index: number }) {
  const { updateColorSample, colors, removeColorSample } =
    useColorPickerStore();
  const { register, handleSubmit, getValues, formState, setValue } =
    useForm<Sample>({
      defaultValues: sample,
    });
  const { draggableTools } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: RemovableIndex) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        dragIndex === hoverIndex
      )
        return;
      if (hoverIndex !== "remove") {
        const { colors } = getValues();
        const colorsMove = moveItem(colors, dragIndex, hoverIndex);
        setValue("colors", colorsMove);
        handleSubmit(submitSample)();
      } else {
        const { colors } = getValues();
        colors.splice(dragIndex, 1);
        setValue("colors", colors);
        handleSubmit(submitSample)();
      }
    }
  );

  const colorsAddList = colors.filter(
    (color) =>
      !sample.colors
        .map((color) => color.toLowerCase())
        .includes(color.toString({ format: "hex" }).toLowerCase())
  );

  function addColor(color: ColorIO) {
    const newColor = color.toString({ format: "hex" });
    const { colors } = getValues();
    if (!colors.includes(newColor)) {
      setValue("colors", [...colors, newColor]);
      handleSubmit(submitSample)();
    }
  }

  function submitSample(sample: Sample) {
    updateColorSample(index, sample);
  }

  function submitName() {
    const { name } = getValues();
    if (sample.name !== name) {
      handleSubmit(submitSample)();
    }
  }

  function handleDragColor(index: number) {
    if (!draggableTools.dragIndex) {
      draggableTools.setDragIndex(index);
    }
  }

  function handleMouseEnter(index: number) {
    if (draggableTools.dragIndex) {
      draggableTools.setHoverIndex(index);
    }
  }

  function getColorContainerClassname(index: number): string {
    const classList = "p-2 drag-hover-left-placeholder";
    if (
      index === draggableTools.dragIndex &&
      draggableTools.hoverIndex === "remove"
    ) {
      return classList + " remove";
    } else if (index === draggableTools.dragIndex) {
      return classList + " draggable";
    } else if (index === draggableTools.hoverIndex) {
      return classList + " drag-hover-left";
    }
    return classList;
  }

  return (
    <Popover>
      <div className={styles.colorSampling} key={sample.name}>
        <div className="row align-center justify-between">
          <div className="row align-center gap-3">
            <MdBookmark size={ICON_SIZE_MD} />
            <h5>
              <input
                {...register("name", { required: "Sample name is required" })}
                className="inherit-input"
                onBlur={submitName}
              />
            </h5>
          </div>
          <div className="row align-center gap-3">
            {!draggableTools.dragIndex && (
              <>
                <Popover.Toggle
                  id="add-color"
                  positionPayload="top-right"
                  disabled={!colorsAddList.length}
                >
                  <button
                    className="action-ghost-button"
                    disabled={!colorsAddList.length}
                  >
                    <MdAdd size={ICON_SIZE_MD} />
                  </button>
                </Popover.Toggle>
                <Popover.Toggle id="delete-sample" positionPayload="top-right">
                  <button className="action-ghost-button">
                    <MdMoreHoriz size={ICON_SIZE_MD} />
                  </button>
                </Popover.Toggle>
              </>
            )}
            {draggableTools.dragIndex && (
              <button
                className="remove-button"
                style={{
                  ...getRectSize({ height: "var(--uidt-space-7)" }),
                }}
                onMouseEnter={() => draggableTools.setHoverIndex("remove")}
              >
                <MdDelete size={ICON_SIZE_MD} />
              </button>
            )}
            <Popover.Body
              id="add-color"
              zIndex={1000}
              skipDisableOutside={true}
            >
              <Popover.Actions>
                {colorsAddList.map((colorToAdd, colorIndex) => (
                  <Popover.Tab
                    key={`${colorToAdd.toString({
                      format: "hex",
                    })}-${colorIndex}`}
                    clickEvent={() => addColor(colorToAdd)}
                  >
                    <div
                      className="palette-color"
                      style={{
                        ...getRectSize({ height: "var(--uidt-space-7)" }),
                        background: colorToAdd.toString({ format: "hex" }),
                      }}
                    ></div>
                    {colorToAdd.toString({ format: "hex" })}
                  </Popover.Tab>
                ))}
              </Popover.Actions>
            </Popover.Body>
            <Popover.Body
              id="delete-sample"
              zIndex={1000}
              skipDisableOutside={true}
            >
              <Popover.Actions>
                <Popover.Tab
                  theme="alert"
                  clickEvent={() => removeColorSample(index)}
                >
                  <MdDelete size={ICON_SIZE_MD} /> Remove sample
                </Popover.Tab>
                <Popover.Tab>
                  <MdClose size={ICON_SIZE_MD} /> Cancel
                </Popover.Tab>
              </Popover.Actions>
            </Popover.Body>
          </div>
        </div>
        {formState.errors.name?.message && (
          <small className="error">{formState.errors.name?.message}</small>
        )}
        <div className={styles.colorsPreview}>
          {sample.colors.map((color, index) => (
            <div className={getColorContainerClassname(index)}>
              <div
                className="palette-color"
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={() => handleDragColor(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                key={`${color}-${index}`}
                style={{
                  background: color,
                  ...getRectSize({ height: "var(--uidt-space-7)" }),
                }}
              ></div>
            </div>
          ))}
          <div className="p-2">
            {draggableTools.dragIndex === undefined ? (
              <Popover.Toggle
                id="add-color"
                positionPayload="top-right"
                disabled={!colorsAddList.length}
              >
                <button
                  className="add-button"
                  disabled={!colorsAddList.length}
                  style={{
                    ...getRectSize({ height: "var(--uidt-space-7)" }),
                  }}
                >
                  <MdAdd size={ICON_SIZE_MD} />
                </button>
              </Popover.Toggle>
            ) : (
              <button
                className="remove-button"
                style={{
                  ...getRectSize({ height: "var(--uidt-space-7)" }),
                }}
                onMouseEnter={() => draggableTools.setHoverIndex("remove")}
              >
                <MdDelete size={ICON_SIZE_MD} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default ColorSample;
