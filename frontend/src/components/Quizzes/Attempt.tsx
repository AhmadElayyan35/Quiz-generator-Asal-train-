import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { GetAttemptById } from '../../APIs/Quizzes/GetAttemptById';
import { Answer } from '../QuizGenerator/data/quiz';
import { Container, CorrectAnswer, Explanation, Question, QuizContainer, Title, WrongAnswer } from '../QuizGenerator/Quiz.styles';
import { Input, Radio, RadioGroup } from '@fluentui/react-components';
import { handleChooseAnswerForMultipleChoice } from '../QuizGenerator/Quiz';
import LoadingSpinner from '../LoadingSpinner';
import NotFound from '../NotFound';
import BackContainer from '../BackContainer';
import { useApi } from '../../hooks/useApi';

function Attempt() {

  const { categoryId, attemptId } = useParams();
  const [answers, setAnswers] = useState<Answer[]>([])
  const [notFound, setNotFound] = useState(false)
  const apiFetch = useApi()
  useEffect(() => {
    if (!categoryId || !attemptId) return;
    const loadAttempt = async () => {
      try {
        const attempt = await GetAttemptById(apiFetch, parseInt(attemptId))
        setAnswers(attempt.answers)
      } catch (error) {
        setNotFound(true)
      }
    }
    loadAttempt()
  }, [categoryId, attemptId])

  if (notFound) {
    return <NotFound />
  }
  if (answers.length === 0) return <LoadingSpinner label='Loading attempt...' />
  return (
    <QuizContainer>
      <BackContainer />
      {answers.map((q) => (
        <Container key={q.question_number} className='question-container'>
          <Question className='question'>{q.question_number}.{q.question}</Question>
          {q.type === 'multiple_choice' && q.choices ? (
            <RadioGroup
              value={q.user_answer}
              disabled
            >
              {q.choices.map((choice, index) => {
                const value = handleChooseAnswerForMultipleChoice(index + 1);
                const isCorrect = value === q.correct_answer;
                const isSelected = value === q.user_answer;

                return (
                  <Radio
                    key={choice}
                    value={value}
                    label={choice}
                    style={{
                      backgroundColor: isCorrect
                        ? '#e6ffed'
                        : isSelected
                          ? '#ffe6e6'
                          : '',
                    }}
                  />
                );
              })}
            </RadioGroup>
          ) : (
            <Input
              type="text"
              value={q.user_answer || ''}
              readOnly
            />
          )}
          {q.type === 'multiple_choice' &&
            (q.correct_answer === q.user_answer ? (
              <CorrectAnswer>✔ Correct</CorrectAnswer>
            ) : (
              <WrongAnswer>✘ Wrong</WrongAnswer>
            ))}
          <Explanation>Explanation: {q.explanation}</Explanation>
        </Container>
      ))}


    </QuizContainer>
  )
}

export default Attempt
