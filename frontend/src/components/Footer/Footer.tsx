import React from 'react';
import { Text, Link } from "@fluentui/react-components";
import {
  FooterContainer,
  FooterText,
  FooterList,
  FooterListItem,
  FooterSections,
  FooterSection,
  FooterHeading,
  FooterParagraph
} from './Footer.styles';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterSections>
        <FooterSection id='about'>
          <FooterHeading>About Us</FooterHeading>
          <FooterParagraph>QuizGen AI helps you generate quizzes from your documents in seconds.</FooterParagraph>
        </FooterSection>

        <FooterSection id='contact'>
          <FooterHeading>Contact Us</FooterHeading>
          <FooterParagraph>Email: support@quizgenai.com</FooterParagraph>
          <Text style={{ display: 'block' }} size={200}>Phone: +1 (555) 123-4567</Text>
        </FooterSection>

        <FooterSection>
          <FooterList>
            <FooterListItem><Link href="#">Privacy Policy</Link></FooterListItem>
            <FooterListItem><Link href="#">Terms of Use</Link></FooterListItem>
            <FooterListItem><Link href="#">Support</Link></FooterListItem>
          </FooterList>
        </FooterSection>
      </FooterSections>

      <FooterText>&copy; 2025 QuizGen AI. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;
