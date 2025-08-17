import styled from "styled-components";

const InputText = styled.input`
  padding: 8px;
  border: 1px solid transparent;
  background-color: var(--uit-component-bg);
  border-radius: var(--uit-rounded-md);
  box-shadow: var(--uit-shadow-sm);
  font-size: inherit;
  height: var(--uit-space-7);
  box-sizing: border-box;

  &:hover{
    outline: var(--uit-primary-outline-light-border) 1px solid;
  }

  &:focus{
    outline: var(--uit-primary-outline-border) 1px solid;
  }
`;

export default InputText;
