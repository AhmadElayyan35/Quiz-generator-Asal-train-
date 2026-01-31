import React, { useState } from 'react'
import { Answer, Btn, ButtonsContainer, Choice, Container, CorrectAnswer, Explanation, Question, QuizContainer, Title, WrongAnswer } from './Quiz.styles';
import { Button, Input, Radio, RadioGroup, Text } from '@fluentui/react-components';
import { QuizQuestion } from './data/quiz'
import {
  ArrowClockwise24Regular,
  Eye24Regular,
  EyeOff24Regular,
  Delete24Regular
} from "@fluentui/react-icons";
import RegenerateQuestionDialog from './RegenerateQuestionDialog';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RegenerateQuestion } from '../../APIs/Quizzes/RegenerateQuestion';
import LoadingDialog from '../Category/LoadingDialog';
import { SaveQuiz } from '../../APIs/Quizzes/SaveQuiz';
import { StartQuiz } from '../../APIs/Quizzes/StartQuiz';
import { SubmitQuizAttempt } from '../../APIs/Quizzes/SubmitQuizAttempt';
import { useToastController, Toaster } from '@fluentui/react-components';
import { FailToast, SuccessToast } from '../Categories/Categories.styles';
import BackContainer from '../BackContainer';
import { useApi } from '../../hooks/useApi';


 export function handleChooseAnswerForMultipleChoice(answerNumber: number) {
    if (answerNumber === 1) {
      return 'A';
    } else if (answerNumber === 2) {
      return 'B';
    } else if (answerNumber === 3) {
      return 'C';
    } else if (answerNumber === 4) {
      return 'D';
    }
  }
  
const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { questions, quizName, difficulty, indexName } = location.state || {};

  const [quiz, setQuiz] = useState<QuizQuestion[]>(questions)

  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isRequired, setIsRequired] = useState('');
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
  const [openRegenerateDialog, setOpenRegenerateDialog] = useState(false);
  const [regenerateQuestion, setRegenerateQuestion] = useState<number>();
  const [regenerateReason, setRegenerateReason] = useState<string>('');
  const [loadingDialog, setLoadingDialog] = useState(false);
  const apiFetch = useApi()
  const navigate = useNavigate();
  const { dispatchToast } = useToastController();


  function handleShowAnswer(questionNumber: number) {
    const question = quiz.find(q => q.question_number === questionNumber);
    const answer = question?.correct_answer;
    if (answer) {
      setShowAnswer({
        ...showAnswer,
        [questionNumber]: !showAnswer[questionNumber]
      });
    }

  }
  async function handleFinishAttempt() {
    if (Object.keys(selectedAnswers).length !== quiz.length) {
      setIsRequired('Please answer all questions before finishing the quiz.');
      return;
    }
    setIsRequired('');
    setLoadingDialog(true);
    const answers = quiz.map((question) => {
      return {
        ...question,
        user_answer: selectedAnswers[question.question_number] || '',
      }
    });
    if (!id) return;
    await SubmitQuizAttempt(apiFetch, parseInt(id), answers)
      .finally(() => setLoadingDialog(false));
    setIsFinish(true);
    const correctAnswers = quiz.map((question) => {
      if (question.type === 'multiple_choice' && question.correct_answer === selectedAnswers[question.question_number])
        return true;
      else
        return false;
    });
    setCorrectAnswers(correctAnswers);

  }
  function handleStartQuiz() {
    setLoadingDialog(true);
    StartQuiz(apiFetch, indexName).finally(() => {
      setLoadingDialog(false);
    });
    setIsStart(true)
  }
  async function handleSaveQuiz() {
    if (!id) {
      alert("Quiz category ID is missing.");
      return;
    }
    setLoadingDialog(true);
    try {
      await SaveQuiz(apiFetch, parseInt(id), quizName, difficulty, indexName, quiz)
      dispatchToast(
        <SuccessToast>Quiz saved successfully!</SuccessToast>,
        { position: 'bottom-end', intent: 'success' }
      );
      navigate(`/categories/${id}`);
    } catch (error) {
      dispatchToast(
        <FailToast>Failed to save quiz</FailToast>,
        { position: 'bottom-end', intent: 'error' }
      );
    } finally {
      setLoadingDialog(false);
    }

  }
  function handleClear(questionNumber: number) {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionNumber]: ''
    })
  }
  function handleRegenerate(questionNumber: number) {
    setRegenerateQuestion(questionNumber);
    setOpenRegenerateDialog(true);
  }
  async function handleRegenerateQuestion() {
    if (regenerateQuestion) {
      try {
        setOpenRegenerateDialog(false);
        setRegenerateReason('');
        setLoadingDialog(true)
        const newQuestion = await RegenerateQuestion(apiFetch, indexName, difficulty, regenerateReason, regenerateQuestion, quiz).finally(() => setLoadingDialog(false));

        setQuiz(prevQuiz =>
          prevQuiz.map(q =>
            q.question_number === regenerateQuestion ? {
              question_number: newQuestion.question_number + 1,
              question: newQuestion.question,
              type: newQuestion.type,
              choices: newQuestion.choices,
              correct_answer: newQuestion.correct_answer,
              explanation: newQuestion.explanation
            } : q
          )
        );


      }
      catch (error) {
        console.error('Error regenerating question:', error);
        alert('Failed to regenerate question. Please try again.');
      }
    }

  }
  function handleGoToQuizes() {
    navigate(`/categories/${id}`);
  }
  const checkForDisable = Object.values(selectedAnswers).every(answer => answer !== '');

  return (
    <QuizContainer>
      <BackContainer />

      <Title>{quizName}</Title>

      {!isFinish ? (quiz.map((question) => (
        <Container key={question.question_number} className='question-container'>
          <Question className='question'>{question.question_number}.{question.question}</Question>
          {!isStart ? (question.type === 'multiple_choice' && question.choices ? <ul className='choices'>
            {question.choices.map((choice) => (
              <Choice>{choice}</Choice>
            ))}
          </ul> : <Input value={selectedAnswers[question.question_number] || ''} readOnly placeholder='Type Your Answer' />) : (
            question.type === 'multiple_choice' && question.choices ?
              <RadioGroup
                value={selectedAnswers[question.question_number] || ''}
                onChange={(e, data) => setSelectedAnswers({ ...selectedAnswers, [question.question_number]: data.value })}>
                {question.choices.map((choice, index) => (
                  <Radio key={choice} value={handleChooseAnswerForMultipleChoice(index + 1)} label={choice} />
                ))}
              </RadioGroup>
              : <Input value={selectedAnswers[question.question_number] || ''} onChange={(e, data) => setSelectedAnswers({ ...selectedAnswers, [question.question_number]: data.value })} placeholder='Type Your Answer' />)}

          <ButtonsContainer>
            {!isStart ? <>  <Button
              icon={<ArrowClockwise24Regular />}
              title="Regenerate Question"
              onClick={() => handleRegenerate(question.question_number)}
            />
              <Button
                icon={showAnswer[question.question_number] ? <EyeOff24Regular /> : <Eye24Regular />}
                title={showAnswer[question.question_number] ? "Hide Answer" : "Show Answer"}
                onClick={() => handleShowAnswer(question.question_number)}
              /></> : <Button
              icon={<Delete24Regular />}
              title="Clear Answer"
              onClick={() => handleClear(question.question_number)}
            />}
          </ButtonsContainer>
          {showAnswer[question.question_number] && <Answer>Answer: {question.correct_answer}</Answer>}

        </Container>
      ))) : (quiz.map((question) => (
        <Container className='question-container'>
          <Question className='question'>{question.question_number}.{question.question}</Question>
          {question.type === 'multiple_choice' && question.choices ? <RadioGroup
            value={selectedAnswers[question.question_number]}
            disabled
          >
            {question.choices.map((choice, index) => (
              <Radio style={{ backgroundColor: handleChooseAnswerForMultipleChoice(index + 1) === question.correct_answer ? '#e6ffed' : handleChooseAnswerForMultipleChoice(index + 1) === selectedAnswers[question.question_number] ? '#ffe6e6' : '' }} key={choice} value={handleChooseAnswerForMultipleChoice(index + 1)} label={choice} />
            ))}
          </RadioGroup> : <Input type='text' value={selectedAnswers[question.question_number] || ''} readOnly />}

          {question.type === 'multiple_choice' && (correctAnswers[question.question_number - 1] === true ? <CorrectAnswer> ✔ Correct Answer</CorrectAnswer> : <WrongAnswer> ✘ Wrong Answer</WrongAnswer>)}
          <Explanation>Explanation: {question.explanation}</Explanation>
        </Container>
      )))}
      {isRequired && <Text color="red">{isRequired}</Text>}

      {!isFinish ? (!isStart ?
        <><Btn onClick={handleSaveQuiz}>Save  Quiz</Btn>
          <Btn onClick={handleStartQuiz}>Start  Quiz</Btn></>
        : <Btn disabled={!checkForDisable} onClick={handleFinishAttempt}>Finish Attempt</Btn>) : <Btn onClick={handleGoToQuizes}>Go To Quizes</Btn>}


      {openRegenerateDialog && regenerateQuestion && <RegenerateQuestionDialog openRegenerateDialog={openRegenerateDialog} setOpenRegenerateDialog={setOpenRegenerateDialog} questionNumber={regenerateQuestion} regenerateReason={regenerateReason} setRegenerateReason={setRegenerateReason} onRegenerate={handleRegenerateQuestion} />}

      {loadingDialog && <LoadingDialog loadingDialog={loadingDialog} />}
      

      <Toaster />

      <Toaster />

    </QuizContainer>
  )
}

export default Quiz

