import styled from "styled-components";
import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import { getRectSize } from "../../../../ui/UiConstants";

const CombinationPreview = styled.button<{
  $combination: ColorCombinationCollection;
}>`
  flex: 1;
  height: 100%;
  border-radius: var(--uidt-rounded-md);
  box-shadow: var(--uidt-shadow-md);
  display: flex;
  flex-direction: column;
  align-items: start;
  font-weight: inherit;
  font-size: inherit;
  background-color: var(--${(props) => props.$combination.default?.background});
  color: var(--${(props) => props.$combination.default?.text});
  border: var(--${(props) => props.$combination.default?.border}) 1px solid;
  padding: 0px;
  box-sizing: border-box;
  overflow: hidden;
  .border-bottom {
    border-bottom: var(--${(props) => props.$combination.default?.border}) 1px
      solid;
    width: 100%;
    padding: var(--uidt-space-3);
  }

  .header-circle {
    border-radius: 50%;
    background-color: var(
      --${(props) => props.$combination.default?.border ?? props.$combination.default?.text}
    );
  }

  .hover-text {
    display: none;
  }

  .active-text {
    display: none;
  }

  .focus-text {
    display: none;
  }

  &:hover {
    background-color: var(--${(props) => props.$combination.hover?.background});
    color: var(--${(props) => props.$combination.hover?.text});
    border: var(--${(props) => props.$combination.hover?.border}) 1px solid;

    .hover-text {
      display: block;
    }
  }

  &:focus {
    background-color: var(--${(props) => props.$combination.focus?.background});
    color: var(--${(props) => props.$combination.focus?.text});
    border: var(--${(props) => props.$combination.focus?.border}) 1px solid;

    .hover-text {
      display: none;
    }

    .focus-text {
      display: block;
    }
  }

  &:active {
    background-color: var(
      --${(props) => props.$combination.active?.background}
    );
    color: var(--${(props) => props.$combination.active?.text});
    border: var(--${(props) => props.$combination.active?.border}) 1px solid;

    .hover-text {
      display: none;
    }

    .focus-text {
      display: none;
    }

    .active-text {
      display: block;
    }
  }
`;

function CombinationComponentPlaceholder({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <CombinationPreview $combination={combination}>
      <div className="row gap-3 box-sizing align-center border-bottom">
        <div
          className="header-circle"
          style={{
            transform: "translateY(-1px)",
            ...getRectSize({
              height: "var(--uidt-space-4)",
            }),
          }}
        />
        <strong>Component</strong>
      </div>
      <div className="flex-1 w-full row justify-center p-4 border-box">
        {combination.combinationName && (
          <>
            {combination.combinationName}
            <div className="hover-text">-hover</div>
            <div className="active-text">-active</div>
            <div className="focus-text">-focus</div>
          </>
        )}
      </div>
    </CombinationPreview>
  );
}

export default CombinationComponentPlaceholder;
