import React from 'react';
import {
  FeaturesSection,
  FeaturesTitle,
  FeaturesGrid,
  FeatureCard,
  FeatureHeading,
  FeatureDescription
} from './Features.styles';

const Features: React.FC = () => {
  return (
    <FeaturesSection>
      <FeaturesTitle>Features You'll Love</FeaturesTitle>
      <FeaturesGrid>
        <FeatureCard>
          <FeatureHeading>Multiple Question Types</FeatureHeading>
          <FeatureDescription>
            Generate MCQs, True/False, Short Answer and more!
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureHeading>Customizable Quizzes</FeatureHeading>
          <FeatureDescription>
            Edit questions, add explanations, and adjust difficulty.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureHeading>Export & Share</FeatureHeading>
          <FeatureDescription>
            Download as PDF or share directly with your students.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </FeaturesSection>
  );
};

export default Features;
