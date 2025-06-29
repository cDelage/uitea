import { createContext, useContext, useEffect, useState } from "react";

export type RemovableIndex = number  | "remove";

export type DraggableTools = {
  dragIndex?: number;
  hoverIndex?: RemovableIndex;
  setDragIndex: (dragId: number | undefined) => void;
  setHoverIndex: (dragId: number | undefined | "remove") => void;
};

export const DraggableContext = createContext<DraggableTools | null>(null);

export const ParentDraggableContext = createContext<DraggableTools | null>(
  null
);

export function useDraggableContext() {
  const context = useContext(DraggableContext);
  if (!context) throw Error("Draggable context was used outside of his scope");
  return context;
}

export function useParentDraggableContext() {
  const context = useContext(ParentDraggableContext);
  if (!context) throw Error("Draggable context was used outside of his scope");
  return context;
}

export function useDraggableFeatures(
  dragEvent: (dragIndex?: number, hoverIndex?: RemovableIndex) => void
) {
  const [dragIndex, setDragIndex] = useState<number | undefined>(undefined);
  const [hoverIndex, setHoverIndex] = useState<RemovableIndex | undefined>(undefined);
  const draggableTools: DraggableTools = {
    dragIndex,
    hoverIndex,
    setDragIndex,
    setHoverIndex,
  };

  useEffect(() => {
    function handleDragEvent() {
      dragEvent(dragIndex, hoverIndex);
      window.removeEventListener("mouseup", handleDragEvent);
      setDragIndex(undefined);
      setHoverIndex(undefined);
    }
    if (dragIndex !== undefined) {
      window.addEventListener("mouseup", handleDragEvent);
    } else {
      window.removeEventListener("mouseup", handleDragEvent);
    }

    return () => {
      window.removeEventListener("mouseup", handleDragEvent);
    };
  }, [dragIndex, dragEvent, hoverIndex]);
  return { draggableTools };
}


