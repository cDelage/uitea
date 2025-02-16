import { ReactNode } from "react";
import {
  ParentDraggableContext,
  useDraggableFeatures,
} from "../../util/DraggableContext";
import { useDesignSystemContext } from "./DesignSystemContext";
import { useParams } from "react-router-dom";
import { useSaveDesignSystem } from "./DesignSystemQueries";

function DraggableList({
  children,
  keyList,
}: {
  children: ReactNode;
  keyList: "palettes" | "themes";
}) {
  const { designSystem } = useDesignSystemContext();
  const { designSystemPath } = useParams();
  const { saveDesignSystem } = useSaveDesignSystem(designSystemPath);
  const { draggableTools: draggableFeatures } = useDraggableFeatures(
    (dragIndex?: number, hoverIndex?: number) => {
      if (
        dragIndex === undefined ||
        hoverIndex === undefined ||
        !designSystem ||
        dragIndex === hoverIndex
      )
        return;
      const newList = [...designSystem[keyList]];
      const dragElement = newList.splice(dragIndex, 1);
      newList.splice(hoverIndex, 0, dragElement[0]);
      saveDesignSystem({
        designSystem: {
          ...designSystem,
          [keyList]: newList,
        },
        isTmp: true,
      });
    }
  );

  return (
    <ParentDraggableContext.Provider value={draggableFeatures}>
      {children}
    </ParentDraggableContext.Provider>
  );
}

export default DraggableList;
