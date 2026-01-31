import styled from 'styled-components';
import { DefaultButton, PrimaryButton as FluentPrimaryButton } from '@fluentui/react';

export const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 40px;
  background-color: #f4f9ff;
`;

export const HeroText = styled.div`
  max-width: 50%;
`;

export const HeroTitle = styled.h1`
  font-size: 36px;
  line-height: 1;
  color: #1e2a38;
`;

export const HeroParagraph = styled.p`
  font-size: 18px;
  color: #555;
  margin: 20px 0;
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const PrimaryButton = styled(FluentPrimaryButton)`
  && {
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 8px;
  }
`;

export const SecondaryButton = styled(DefaultButton)`
  && {
    padding: 12px 24px;
    font-weight: 600;
    color: #4fc3f7;
    border: 2px solid #4fc3f7;
    background-color: transparent;
    border-radius: 8px;
  }
`;

export const HeroImageWrapper = styled.div``;

export const HeroImage = styled.img`
  width: 100%;
  max-width: 400px;
`;
