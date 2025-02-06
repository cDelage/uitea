import { createContext, useContext, useEffect, useState } from "react";

export type DraggableContextType = {
  dragIndex?: number;
  hoverIndex?: number;
  setDragIndex: (dragId: number | undefined) => void;
  setHoverIndex: (dragId: number | undefined) => void;
};

export const DraggableContext = createContext<DraggableContextType | null>(
  null
);

export const ParentDraggableContext =
  createContext<DraggableContextType | null>(null);

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
  dragEvent: (dragIndex?: number, hoverIndex?: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | undefined>(undefined);
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);
  const draggableFeatures: DraggableContextType = {
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
  return { draggableFeatures };
}
