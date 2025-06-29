import { CanUndoRedo } from "./UndoRedo";

export interface HeaderTools {
    pageName: string;
    canUndoRedo?: CanUndoRedo;
    isTmp?: boolean;
    isHome?: boolean;
    undo?: () => void;
    redo?: () => void;
}