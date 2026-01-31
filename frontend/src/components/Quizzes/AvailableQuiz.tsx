import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GetQuizById } from '../../APIs/Quizzes/GetQuizById';
import { QuizInfo, QuizQuestion } from '../QuizGenerator/data/quiz';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
} from '@fluentui/react-components';
import { Delete24Regular, Eye24Regular, EyeOff24Regular } from '@fluentui/react-icons';
import { Answer, Btn, ButtonsContainer, Choice, Container, CorrectAnswer, Explanation, Question, QuizContainer, Title, WrongAnswer } from '../QuizGenerator/Quiz.styles';
import { handleChooseAnswerForMultipleChoice } from '../QuizGenerator/Quiz';
import { SubmitQuizAttempt } from '../../APIs/Quizzes/SubmitQuizAttempt';
import LoadingDialog from '../Category/LoadingDialog';
import LoadingSpinner from '../LoadingSpinner';
import NotFound from '../NotFound';
import BackContainer from '../BackContainer';
import { useApi } from '../../hooks/useApi';

function AvailableQuiz() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location.state || {};
  const apiFetch = useApi()

  const [status, setStatus] = useState(state)
  const { categoryId, quizId } = useParams();
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [finish, setFinish] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: boolean }>({});
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [notFound, setNotFound] = useState(false)
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false
  });
  useEffect(() => {
    if (!categoryId || !quizId) return;

    try {
      GetQuizById(apiFetch, parseInt(categoryId), parseInt(quizId), setQuiz, setQuestions,
      );
    } catch (error) {
      setNotFound(true)
    }
  }, [categoryId, quizId]);

  const handleClear = (questionNumber: number) => {
    const updated = { ...selectedAnswers };
    delete updated[questionNumber];
    setSelectedAnswers(updated);
  };

  async function handleFinishAttempt() {
    setLoadingDialog(true);
    const answers = questions.map((question) => {
      return {
        ...question,
        user_answer: selectedAnswers[question.question_number] || '',
      }
    });
    if (!categoryId || !quizId) return;
    await SubmitQuizAttempt(apiFetch, parseInt(categoryId), answers)
      .finally(() => setLoadingDialog(false));
    setFinish(true);
    const correctAnswers = questions.map((question) => {
      if (question.type === 'multiple_choice' && question.correct_answer === selectedAnswers[question.question_number])
        return true;
      else
        return false;
    });
    setCorrectAnswers(correctAnswers);

  }

  const handleGoToQuizzes = () => {
    navigate(`/categories/${categoryId}`);
  };
  function handleShowAnswer(questionNumber: number) {
    const question = questions.find(q => q.question_number === questionNumber);
    const answer = question?.correct_answer;
    if (answer) {
      setShowAnswer({
        ...showAnswer,
        [questionNumber]: !showAnswer[questionNumber]
      });
    }

  }
  const checkForDisable = questions.length > 0 && questions.every(q =>
    selectedAnswers[q.question_number] && selectedAnswers[q.question_number] !== ''
  );



  if (notFound) {
    return <NotFound />
  }
  if (!quiz) return <LoadingSpinner label='Loading quiz...' />;

  return (
    <QuizContainer>
      <BackContainer />
      <Title>{quiz.name}</Title>
      {status === 'start' ? (!finish ? (
        questions.map((q) => (
          <Container key={q.question_number} className='question-container'>
            <Question className='question'>{q.question_number}.{q.question}</Question>
            {q.type === 'multiple_choice' && q.choices ? (
              <RadioGroup
                value={selectedAnswers[q.question_number] || ''}
                onChange={(e, data) =>
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [q.question_number]: data.value,
                  })
                }
              >
                {q.choices.map((choice, index) => (
                  <Radio
                    key={choice}
                    value={handleChooseAnswerForMultipleChoice(index + 1)}
                    label={choice}
                  />
                ))}
              </RadioGroup>
            ) : (
              <Input
                value={selectedAnswers[q.question_number] || ''}
                onChange={(e, data) =>
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [q.question_number]: data.value,
                  })
                }
                placeholder="Type Your Answer"
              />
            )}
            <ButtonsContainer>
              <Button
                icon={<Delete24Regular />}
                title="Clear Answer"
                onClick={() => handleClear(q.question_number)}
                appearance="secondary"
                style={{ marginTop: '0.5rem' }}
              />

            </ButtonsContainer>

          </Container>
        ))
      ) : (
        questions.map((q) => (
          <Container key={q.question_number} className='question-container'>
            <Question className='question'>{q.question_number}. {q.question}</Question>
            {q.type === 'multiple_choice' && q.choices ? (
              <RadioGroup
                value={selectedAnswers[q.question_number]}
                disabled
              >
                {q.choices.map((choice, index) => {
                  const value = handleChooseAnswerForMultipleChoice(index + 1);
                  const isCorrect = value === q.correct_answer;
                  const isSelected = value === selectedAnswers[q.question_number];

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
                value={selectedAnswers[q.question_number] || ''}
                readOnly
              />
            )}
            {q.type === 'multiple_choice' &&
              (correctAnswers[q.question_number] ? (
                <CorrectAnswer> ✔ Correct Answer</CorrectAnswer>
              ) : (
                <WrongAnswer> ✘ Wrong Answer</WrongAnswer>
              ))}
            <Explanation>Explanation: {q.explanation}</Explanation>
          </Container>
        ))
      )) : (
        questions.map((q) => (
          <Container key={q.question_number} className='question-container'>
            <Question className='question'>{q.question_number}.{q.question}</Question>
            {q.type === 'multiple_choice' && q.choices ? <ul className='choices'>
              {q.choices.map((choice) => (
                <Choice key={`${q.question_number}-${choice}`}>{choice}</Choice>
              ))}
            </ul> : <Input value={selectedAnswers[q.question_number] || ''} readOnly placeholder='Type Your Answer' />
            }
            <ButtonsContainer>
              <Button
                icon={showAnswer[q.question_number] ? <EyeOff24Regular /> : <Eye24Regular />}
                title={showAnswer[q.question_number] ? "Hide Answer" : "Show Answer"}
                onClick={() => handleShowAnswer(q.question_number)}
              />
            </ButtonsContainer>
            {showAnswer[q.question_number] && <Answer>Answer: {q.correct_answer}</Answer>}
          </Container>
        ))
      )}

      {status === 'start' ? (!finish ? (
        <Btn
          onClick={handleFinishAttempt}
          disabled={!checkForDisable}
        >
          Finish Attempt
        </Btn>
      ) : (
        <Btn onClick={handleGoToQuizzes}>Go To Quizzes</Btn>
      )) : <Btn onClick={() => setStatus('start')}>Start Quiz</Btn>}
      {loadingDialog && <LoadingDialog loadingDialog={loadingDialog} />}

    </QuizContainer>
  );
}

export default AvailableQuiz;
