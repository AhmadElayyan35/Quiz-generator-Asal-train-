import { Button, DialogBody, Table, Text, tokens } from "@fluentui/react-components"
import styled from "styled-components"

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color:#f9f9f9; 
`;
export const Container = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacingVerticalXL};
  `
export const StyledTable = styled(Table)`
    max-width: 100%;
  `
export const FormGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${tokens.spacingHorizontalM};
`
export const StyledButton = styled(Button)`
    margin-top: ${tokens.spacingVerticalM};
    align-self: center;
    `

export const HiddenInput = styled.input`
    display: none;
    `
export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
`;
export const QuizActions = styled.div`
    display: flex;
    gap: 10px;
`;
export const DeleteButton = styled(Button)`
    background-color: red;  
    color: white;
    &:hover {   
      background-color: darkred;
      color: white;
    }
`

export const StyledLoadingDialog = styled(DialogBody)`
    display: flex;  
    justify-content: center;
    align-items: center;  
    `

export const ConfirmDeleteQuestion = styled(Text)`
    display : block;
    `

export const QuizName = styled.input`
    display: block;
    width: 100%;
    `
