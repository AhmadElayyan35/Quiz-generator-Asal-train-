import * as React from 'react';
import { Text } from '@fluentui/react-components';
import { ContentContainer, StatContainer } from './Dashboard.styles';
import Card from './Card';
import { Category } from '../../Categories/Categories';
import { Document } from '../../Category/Category';
import { Quiz, QuizAttempt } from '../../QuizGenerator/data/quiz';



const DashboardContent = ({
  userName,
  categoriesList,
  documentsList,
  quizzesList,
  attemptsList,
}: {
  userName: string;
  categoriesList: Category[];
  documentsList: Document[];
  quizzesList: Quiz[];
  attemptsList: QuizAttempt[];
}) => {
  return (
    <ContentContainer>
      <Text size={700} weight="bold">Welcome back, {userName}!</Text>
      <Text size={400} block>Here’s a quick overview of your dashboard.</Text>

      <StatContainer>
        <Card url='/categories' list={categoriesList} title='Categories' />
        <Card url='/documents' list={documentsList} title='Documents' />
        <Card url='/quizzes' list={quizzesList} title='Quizzes' />
        <Card url='/attempts' list={attemptsList} title='Attempts' />
      </StatContainer>
    </ContentContainer>
  );
};

export default DashboardContent;