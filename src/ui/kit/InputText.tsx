import styled from "styled-components";

const InputText = styled.input`
  padding: 8px;
  border: 1px solid transparent;
  background-color: var(--uidt-component-bg);
  border-radius: var(--uidt-rounded-md);
  box-shadow: var(--uidt-shadow-sm);
  font-size: inherit;
  height: var(--uidt-space-7);
  box-sizing: border-box;

  &:hover{
    outline: var(--uidt-primary-outline-light-border) 1px solid;
  }

  &:focus{
    outline: var(--uidt-primary-outline-border) 1px solid;
  }
`;

export default InputText;
