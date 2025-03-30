import { MdCheck } from "react-icons/md";
import { Step, StepsContext, useStepsContext } from "../../util/Steps";
import styles from "./StepsList.module.css";
import { ICON_SIZE_SM } from "../UiConstants";
import classNames from "classnames";
import { cloneElement, ReactElement, ReactNode, useState } from "react";
import { getContrastColor } from "../../util/PaletteBuilderTwoStore";
import LeftTooltip from "./LeftTooltip";

function StepsList({
  steps,
  initialActiveStep,
  children,
}: {
  steps: Step[];
  initialActiveStep?: string;
  children: ReactNode;
}) {
  const [activeStep, setActiveStep] = useState<string>(
    initialActiveStep ?? steps[0].stepName
  );

  return (
    <StepsContext
      value={{
        activeStep,
        setActiveStep,
        steps,
      }}
    >
      <div className="row">
        {children}
        <div className={styles.stepList}>
          {steps.map((step, index) => (
            <StepBarCircle
              key={step.stepName}
              step={step}
              index={index}
            ></StepBarCircle>
          ))}
        </div>
      </div>
    </StepsContext>
  );
}

function StepBarCircle({ step, index }: { step: Step; index: number }) {
  const { activeStep, steps, setActiveStep } = useStepsContext();
  const stepStyle = classNames(
    styles.step,
    {
      [styles.stepDone]: step.state === "DONE",
    },
    {
      [styles.stepActive]: activeStep === step.stepName,
    },
    {
      [styles.stepDisabled]: step.disabled,
    },
    {
      "cursor-pointer": activeStep !== step.stepName && !step.disabled,
    }
  );

  function handleClick() {
    if (activeStep !== step.stepName && !step.disabled) {
      setActiveStep(step.stepName);
    }
  }

  return (
    <>
      {index !== 0 && <div className={styles.line}></div>}
      <LeftTooltip
        tooltipBody={<div className="text-no-wrap">{step.stepName}</div>}
      >
        <div
          className={stepStyle}
          onClick={handleClick}
          style={{
            background:
              step.state === "DONE" && step.backgroundDone
                ? step.backgroundDone
                : undefined,
            color:
              step.state === "DONE" && step.backgroundDone
                ? getContrastColor(step.backgroundDone)
                : undefined,
          }}
        >
          {step.state === "DONE" && <MdCheck size={ICON_SIZE_SM} />}
        </div>
      </LeftTooltip>
      {index !== steps.length - 1 && <div className={styles.line}></div>}
    </>
  );
}

function StepBody({
  stepName,
  children,
}: {
  stepName: string;
  children: ReactNode;
}) {
  const { activeStep } = useStepsContext();
  if (activeStep !== stepName) return null;
  return <div className={styles.stepBody}>{children}</div>;
}

function NextStepButton({
  children,
  callback,
}: {
  children: ReactNode;
  callback?: () => void;
}) {
  const { setActiveStep, steps, activeStep } = useStepsContext();

  function handleClick() {
    callback?.();
    const currentActiveStep = steps.findIndex(
      (step) => step.stepName === activeStep
    );
    const newStep = steps[currentActiveStep + 1]?.stepName;
    if (newStep) {
      setActiveStep(newStep);
    }
  }

  return cloneElement(
    children as ReactElement<
      { onClick?: (e: MouseEvent) => void } & {} & {
        onMouseDown?: (e: MouseEvent) => void;
      }
    >,
    {
      onClick: handleClick,
      onMouseDown: (e: MouseEvent) => e.stopPropagation(),
    }
  );
}

StepsList.Step = StepBody;
StepsList.NextStepButton = NextStepButton;

export default StepsList;
