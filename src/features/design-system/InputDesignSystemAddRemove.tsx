import { MdAdd, MdRemove } from "react-icons/md";
import styles from "./InputDesignSystemAddRemove.module.css";
import { DraggableTools } from "../../util/DraggableContext";

function InputDesignSystemAddRemove({
  itemName,
  draggableTools,
  onAppend,
}: {
  itemName: string;
  draggableTools: DraggableTools;
  onAppend: () => void;
}) {
  function handleHover() {
    draggableTools.setHoverIndex("remove");
  }

  function handleMouseLeave(){
    if(draggableTools.hoverIndex === "remove"){
      draggableTools.setHoverIndex(undefined)
    }
  }

  if (draggableTools.dragIndex !== undefined) {
    return (
      <div className={styles.inputRemove} onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
        <MdRemove /> Remove {itemName}
      </div>
    );
  }

  return (
    <div className={styles.inputAdd} onClick={onAppend}>
      <MdAdd /> Add {itemName}
    </div>
  );
}

export default InputDesignSystemAddRemove;
