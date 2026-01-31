import styled from 'styled-components';
import {
  Button,
  LargeTitle,
  Text,
} from '@fluentui/react-components';
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
    background-color: #f9f9f9;
`;
export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;
export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
export const Title = styled(LargeTitle)`
  margin-bottom: 1rem;
  text-align: center;
`;

export const StyledLabel = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  display: inline-block;
`

export const StyledButton = styled(Button)`
margin-top:0.95rem;
`

export const ErrorMessage = styled(Text)`
  color: red;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
`;
export const Hint = styled(Text)`
  margin-top: 0.5rem;
  display: block;
  text-align: end;
`
