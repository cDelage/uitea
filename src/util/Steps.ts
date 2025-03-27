import { createContext, useContext } from "react";
import { ColorOkhsl } from "./PaletteBuilderTwoStore";

export type StepState = "WAITING" | "DONE";

export interface Step {
  stepName: string;
  state: StepState;
  disabled: boolean;
  backgroundDone?: string;
  tintBuilderColor?: ColorOkhsl;
}

export interface StepsContextType {
  activeStep: string;
  setActiveStep: (step: string) => void;
  steps: Step[];
}

export const StepsContext = createContext<StepsContextType | undefined>(
  undefined
);

export function useStepsContext() {
  const context = useContext(StepsContext);
  if (!context) throw new Error("Steps context was used outside of his scope");
  return context;
}
