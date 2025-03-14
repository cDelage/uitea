import styles from "./ButtonImagePicker.module.css";
import { ICON_SIZE_MD } from "../UiConstants";
import { usePopoverContext } from "./PopoverContext";
import classNames from "classnames";
import { MdChevronLeft } from "react-icons/md";

function ButtonImagePicker({ id }: { id: string }) {
  const { openPopoverId } = usePopoverContext();

  const chevronClassname = classNames({
    "rotate-chevron-left": openPopoverId === id,
  });

  const buttonClassname = classNames(styles.imageButton, {
    [styles.imageButtonActive]: openPopoverId === id,
  });

  return (
    <button className={buttonClassname} type="button">
      <MdChevronLeft size={ICON_SIZE_MD} className={chevronClassname} />
    </button>
  );
}

export default ButtonImagePicker;
