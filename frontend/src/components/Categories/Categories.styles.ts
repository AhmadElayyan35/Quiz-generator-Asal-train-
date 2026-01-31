import { Card, Text, Toast } from "@fluentui/react-components";
import styled from "styled-components";

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
`

export const Container = styled.div`
    padding: 32px;
    background-color: #f9f9f9;
    min-height: 100vh;
 `

export const Header = styled.div`
    margin-bottom: 24px;
  `
export const Toolbar = styled.div` 
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  `
export const StyledCard = styled(Card)`
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  `
export const ActionsCell = styled.div` 
    display: flex;
    gap: 8px;
    align-items: center;
    `

export const ErrorText = styled(Text)`
    display: block;
   color: #d13438  
`

export const SuccessToast = styled(Toast)`
background-color: #4caf50 !important;
 color: white !important;
`

export const FailToast = styled(Toast)`
background-color: #d13438 !important;
 color: white !important;
`

