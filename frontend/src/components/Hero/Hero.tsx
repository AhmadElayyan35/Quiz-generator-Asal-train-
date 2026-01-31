import React from 'react';
import quizIllustration from '../../assets/images/quiz_Illustration.png';
import {
  HeroSection,
  HeroText,
  HeroTitle,
  HeroParagraph,
  HeroButtons,
  PrimaryButton,
  SecondaryButton,
  HeroImageWrapper,
  HeroImage
} from './Hero.styles';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HeroSection>
      <HeroText>
        <HeroTitle>Generate Smart Quizzes in Seconds</HeroTitle>
        <HeroParagraph>
          Upload your materials and let AI create engaging questions for you. Ideal for teachers, trainers, and students.
        </HeroParagraph>
        <HeroButtons>
          <PrimaryButton onClick={()=>navigate('/dashboard')}>Get Started</PrimaryButton>
          <SecondaryButton>Learn More</SecondaryButton>
        </HeroButtons>
      </HeroText>
      <HeroImageWrapper>
        <HeroImage src={quizIllustration} alt="Quiz illustration" />
      </HeroImageWrapper>
    </HeroSection>
  );
};

export default Hero;
