import { open } from "@tauri-apps/plugin-dialog";
import ImageLocalComponent from "../../ui/kit/ImageLocal";
import styles from "../design-system/InputPopover.module.css";
import toast from "react-hot-toast";
import { MdOutlineFolder } from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { ButtonTertiary } from "../../ui/kit/Buttons";
import { usePopoverContext } from "../../ui/kit/PopoverContext";

function ImageSelectorPopover({
  width,
  imagesPreset,
  value,
  setValue,
  popoverId
}: {
  width?: string;
  imagesPreset?: string[];
  value?: string;
  setValue: (value: string) => void;
  popoverId?: string;
}) {

  const {closePopover} = usePopoverContext();
  async function handlePickImage() {

    try {
      const folder = (await open({
        multiple: false,
        title: "Sélectionnez une image",
        filters: [
          {
            name: "Images",
            extensions: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
          },
        ],
        defaultPath: ".", // Chemin par défaut
      })) as null | string;

      if (!folder) return;

      setValue(folder);
    } catch (error) {
      toast.error(`Error while selecting the folder : ${error}`);
    }
  }
  return (
    <div
      className={styles.inputPopover}
      data-disableoutside={true}
      onClick={(e) => e.stopPropagation()}
      style={{
        width,
        maxWidth: width,
        minWidth: width,
        boxSizing: "border-box",
      }}
    >
      <div className={styles.popoverHeader}>
        <ButtonTertiary
          type="button"
          onClick={handlePickImage}
        >
          <MdOutlineFolder size={ICON_SIZE_MD} /> From directory
        </ButtonTertiary>
      </div>
      <div className={styles.keyValueMenuContainer}>
        {imagesPreset?.map((image) => (
          <div
            key={image}
            className={styles.imgTab}
            data-active={value === image}
            onClick={() => {
              setValue(image);
              if(popoverId) closePopover(popoverId);
            }}
          >
            <ImageLocalComponent srcPath={image}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageSelectorPopover;
