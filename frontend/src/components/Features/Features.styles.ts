import styled from 'styled-components';

export const FeaturesSection = styled.section`
  background-color: #f0f4f8;
  padding: 4rem 2rem;
  text-align: center;
`;

export const FeaturesTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2.5rem;
  color: #333;
`;

export const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

export const FeatureCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  max-width: 320px;
  text-align: left;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const FeatureHeading = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const FeatureDescription = styled.p`
  color: #555;
`;
