import styled from "styled-components";

export const Select = styled.select<{ $color?: string }>`
  padding: var(--space-2);
  border: none;
  border-radius: var(--radius);
  width: fit-content;
  box-shadow: var(--shadow-solid);
  min-width: 200px;
  background-color: var(--bg-default);
  color: var(--text-main);
  color: ${(props) => props.$color};
  border: var(--border-main) 1px solid;
`;
