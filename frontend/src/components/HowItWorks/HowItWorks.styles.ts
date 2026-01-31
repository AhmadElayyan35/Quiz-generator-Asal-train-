import { BrainCircuit24Regular, Document24Regular, QuestionCircle24Regular } from '@fluentui/react-icons';
import styled from 'styled-components';

export const Section = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

export const StepsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

export const StepCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  flex: 1;
`;

export const StepIcon = styled.div`
  font-size: 2.5rem;
  color: #4a90e2;
  margin-bottom: 1rem;
`;
export const UploadeFile = styled(Document24Regular)`
  width: 50px;
  height: 50px;
`;
export const Brain = styled(BrainCircuit24Regular)`
  width: 50px;
  height: 50px;
`;
export const Question = styled(QuestionCircle24Regular)`
  width: 50px;
  height: 50px;
`;

export const StepHeading = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

export const StepDescription = styled.p`
  font-size: 1rem;
  color: #333;
`;
