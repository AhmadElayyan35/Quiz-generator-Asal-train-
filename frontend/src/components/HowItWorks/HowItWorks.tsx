import React from 'react';
import {
  Section,
  Title,
  StepsContainer,
  StepCard,
  StepIcon,
  StepHeading,
  StepDescription,
  UploadeFile,
  Brain,
  Question
} from './HowItWorks.styles';

const HowItWorks: React.FC = () => {
  return (
    <Section>
      <Title>How It Works</Title>
      <StepsContainer>
        <StepCard>
          <StepIcon><UploadeFile /></StepIcon>
          <StepHeading>1. Upload Materials</StepHeading>
          <StepDescription>
            Upload PDFs, Word documents, or text files containing your learning content.
          </StepDescription>
        </StepCard>
        <StepCard>
          <StepIcon><Brain /></StepIcon>
          <StepHeading>2. AI Analyzes Content</StepHeading>
          <StepDescription>
            Our AI engine processes your material to understand the core concepts and structure.
          </StepDescription>
        </StepCard>
        <StepCard>
          <StepIcon><Question /></StepIcon>
          <StepHeading>3. Get Smart Quizzes</StepHeading>
          <StepDescription>
            Receive auto-generated quizzes you can use, edit, or share with students instantly.
          </StepDescription>
        </StepCard>
      </StepsContainer>
    </Section>
  );
};

export default HowItWorks;
