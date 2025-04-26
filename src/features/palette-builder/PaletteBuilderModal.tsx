import { useModalContext } from "../../ui/kit/ModalContext";
import PaletteBuilderComponent from "./PaletteBuilderComponent";

function PaletteBuilderModal() {
  const { closeModal } = useModalContext();

  return (
    <div>
      <PaletteBuilderComponent isModal={true} closeModal={closeModal} />
    </div>
  );
}

export default PaletteBuilderModal;
