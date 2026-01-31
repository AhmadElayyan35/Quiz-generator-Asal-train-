import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Card,
  Divider,
} from "@fluentui/react-components";
import { Delete20Regular, DocumentAdd20Regular, Eye20Regular, Play20Regular, Play24Regular } from "@fluentui/react-icons";
import { ButtonsContainer, Container, DeleteButton, FormGroup, HiddenInput, PageWrapper, QuizActions, StyledButton, StyledTable } from "./Category.styles";
import { GetDocumentsByCategory } from "../../APIs/Documents/GetDocumentsByCategory";
import { DeleteDocument } from "../../APIs/Documents/DeleteDocument";
import { UploadDocuments } from "../../APIs/Documents/UploadDocuments";
import { Spinner, SpinnerSize } from "@fluentui/react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import LoadingDialog from "./LoadingDialog";
import GenerateQuizDialog from "./GenerateQuizDialog";
import { GetCategoryById } from "../../APIs/Categories/GetCategoryById";
import { GenerateQuiz } from "../../APIs/Quizzes/GenerateQuiz";
import { Quiz, QuizAttempt, QuizQuestion } from "../QuizGenerator/data/quiz";
import { GetQuizzesByCategoryId } from "../../APIs/Quizzes/GetQuizzesByCategoryId";
import { GetAttempts } from "../../APIs/Quizzes/GetAttempts";
import { DeleteQuiz } from "../../APIs/Quizzes/DeleteQuiz";
import { useToastController, Toaster } from '@fluentui/react-components';
import { FailToast, SuccessToast } from "../Categories/Categories.styles";
import { DeleteAttempt } from "../../APIs/Quizzes/DeleteAttempt";
import LoadingSpinner from "../LoadingSpinner";
import NotFound from "../NotFound";
import BackContainer from "../BackContainer";
import { useApi } from "../../hooks/useApi";



export type Document = {
  id: number;
  name: string;
  path: string;
  category_id: number;
};



const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate()
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);
  const [isGeneratedQuiz, setIsGeneratedQuiz] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingDialog, setLoadingDialog] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<number | null>(null);
  const [categoryName, setCategoryName] = React.useState("");
  const [isOpenGenerateDialog, setIsOpenGenerateDialog] = React.useState(false);
  const [quizName, setQuizName] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("easy");
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [indexName, setIndexName] = React.useState("");
  const [availableQuizzes, setAvailableQuizzes] = React.useState<Quiz[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = React.useState<QuizAttempt[]>([]);
  const { dispatchToast } = useToastController();
  const [notFound, setNotFound] = React.useState(false)
  const apiFetch = useApi()

  React.useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await GetCategoryById(apiFetch, parseInt(id), setCategoryName);
        if (!result || result === null) {
          setNotFound(true);
          return;
        }
        await GetDocumentsByCategory(apiFetch, parseInt(id), setDocuments);
        await GetQuizzesByCategoryId(apiFetch, parseInt(id), setAvailableQuizzes);
        await GetAttempts(apiFetch, parseInt(id), setCompletedQuizzes);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [id]);
  function handleClick() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }
  async function handleAddDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setLoadingDialog(true);
      try {
        await UploadDocuments(parseInt(id as string), file)
        dispatchToast(
          <SuccessToast>Document uploaded successfully!</SuccessToast>,
          {
            position: 'bottom-end',
            intent: 'success'
          }
        );
      } catch (error) {
        dispatchToast(
          <FailToast>Failed to upload document</FailToast>,
          {
            position: 'bottom-end',
            intent: 'error'
          }
        );
      } finally {
        setLoadingDialog(false);
      }
      setLoading(true);
      await GetDocumentsByCategory(apiFetch, parseInt(id as string), setDocuments).finally(() => {
        setLoading(false);
      });
    }
  }
  function handleOpenGenerateQuizDialog() {
    setIsOpenGenerateDialog(true);
  }
  async function handleGenerateQuiz() {
    setIsOpenGenerateDialog(false);
    setIsGeneratingQuiz(true);
    // Simulate API call to generate quiz
    await GenerateQuiz(apiFetch, parseInt(id as string), quizName, difficulty, setQuestions, setIndexName)
      .then(() => {
        setIsGeneratingQuiz(false);
        setIsGeneratedQuiz(true);
      })
  }
  function handleOpenConfirmDelete(documentId: number) {
    setConfirmDelete(true);
    setSelectedDocumentId(documentId);
  }
  async function handleDeleteDocument(documentId: number) {
    setConfirmDelete(false);
    setLoadingDialog(true);
    try {
      await DeleteDocument(apiFetch, documentId)
      dispatchToast(
        <SuccessToast>Document Deleted successfully!</SuccessToast>,
        {
          position: 'bottom-end',
          intent: 'success',
        }
      );

    } catch (error) {
      dispatchToast(
        <FailToast>Failed to delete category</FailToast>,
        {
          position: 'bottom-end',
          intent: 'error'
        }
      );

    }
    finally {
      setLoadingDialog(false);
    }
    setLoading(true);
    await GetDocumentsByCategory(apiFetch, parseInt(id as string), setDocuments).finally(() => {
      setLoading(false);
    });
  }
  function handleStartQuiz(quizId: number) {
    navigate(`/categories/${id}/quizzes/${quizId}`, {
      state: {
        state: 'start'
      }
    })

  }
  function handleViewQuiz(quizId: number) {
    navigate(`/categories/${id}/quizzes/${quizId}`, {
      state: {
        state: 'view'
      }
    })
  }
  async function handleDeleteQuiz(quizId: number) {
    setLoadingDialog(true)
    try {
      await DeleteQuiz(apiFetch, quizId)
      dispatchToast(
        <SuccessToast>Quiz Deleted successfully!</SuccessToast>,
        {
          position: 'bottom-end',
          intent: 'success',
        }
      );
    }
    catch (error) {
      dispatchToast(
        <FailToast>Failed to delete quiz</FailToast>,
        {
          position: 'bottom-end',
          intent: 'error'
        }
      );
    } finally {
      setLoadingDialog(false);
    }
    if (!id) return;
    setLoadingDialog(true)
    await GetQuizzesByCategoryId(apiFetch, parseInt(id), setAvailableQuizzes)
      .finally(() => {
        setLoadingDialog(false);
      })

  }
  function handleViewAttempt(categoryId: number, attemptId: number) {
    navigate(`/categories/${categoryId}/attempts/${attemptId}`)
  }
  function handleDeleteAttempt(attemptId: number) {
    setLoadingDialog(true)
    DeleteAttempt(apiFetch, attemptId)
      .then(() => {
        dispatchToast(
          <SuccessToast>Attempt Deleted successfully!</SuccessToast>,
          {
            position: 'bottom-end',
            intent: 'success',
          }
        );
      })
      .catch(() => {
        dispatchToast(
          <FailToast>Failed to delete attempt</FailToast>,
          {
            position: 'bottom-end',
            intent: 'error'
          }
        );
      })
      .finally(() => {
        setLoadingDialog(false);
        if (!id) return;
        setLoadingDialog(true)
        GetAttempts(apiFetch, parseInt(id), setCompletedQuizzes)
          .finally(() => {
            setLoadingDialog(false);
          })
      });
  }

  if (notFound) {
    return <NotFound />
  }
  if (!categoryName) return <LoadingSpinner label="Loading category..." />;

  return (
    <PageWrapper>
      <BackContainer to={'/categories'} />

      {isGeneratingQuiz || isGeneratedQuiz ? (
        <Container>
          <Card>
            <Text size={700} weight="bold">{categoryName}</Text>
            <Text size={400}>Documents ({documents.length} / {3})</Text>
          </Card>

          <Card>
            <Text size={500} weight="semibold">
              {isGeneratingQuiz ? "Generating your quiz..." : "The quiz is ready!"}
              {isGeneratingQuiz && <Spinner style={{ marginLeft: '10px' }} size={SpinnerSize.small} />}
              {
                isGeneratingQuiz && "may take a few seconds"
              }
            </Text>
            {isGeneratedQuiz && (
              <ButtonsContainer>
                <Button appearance="primary" onClick={() => navigate(`/categories/${id}/view-quiz`,
                  {
                    state: {
                      questions: questions,
                      quizName: quizName,
                      difficulty: difficulty,
                      indexName: indexName
                    }
                  }
                )}>
                  View Quiz
                </Button>
              </ButtonsContainer>
            )}
          </Card>
        </Container>
      ) :
        <Container>
          <Card>
            <Text size={700} weight="bold">{categoryName}</Text>
            <Text size={400}>Documents ({documents.length} / {3})</Text>
          </Card>

          <Card style={{ borderRadius: '10px', padding: '24px' }}>
            <Text size={500} weight="semibold">Documents</Text>
            <StyledTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Document Name</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ?
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Spinner style={{ padding: '10px' }} label="Loading documents..." size={SpinnerSize.medium} />
                    </TableCell>
                  </TableRow>
                  : documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Text>No documents added yet.</Text>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>
                          <DeleteButton
                            title="Delete Document"
                            icon={<Delete20Regular />}
                            onClick={() => handleOpenConfirmDelete(doc.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </StyledTable>

            {!loading && documents.length < 3 && (
              <FormGroup>
                <HiddenInput
                  type="file"
                  ref={inputRef}
                  onChange={handleAddDocument}
                />
                <Button
                  icon={<DocumentAdd20Regular />}
                  onClick={handleClick}
                  appearance="primary"
                >
                  Add Document
                </Button>
              </FormGroup>
            )}

            {documents.length > 0 && (
              <StyledButton onClick={handleOpenGenerateQuizDialog} appearance="primary"
                icon={<Play24Regular />}  >
                Generate Quiz
              </StyledButton>
            )}
          </Card>
        </Container>}
      <Divider />

      <Card style={{ margin: '24px', borderRadius: '10px', padding: '24px' }}>
        <Text size={500} weight="semibold">Available Quizes</Text>
        <Text size={400}>Quizes just created but the user not attempt this</Text>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Quiz Name</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ?
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner style={{ padding: '10px' }} label="Loading quizzes..." size={SpinnerSize.medium} />
                </TableCell>
              </TableRow>
              : availableQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Text>No Quizes added yet.</Text>
                  </TableCell>
                </TableRow>
              ) : (
                availableQuizzes.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.id}</TableCell>
                    <TableCell>{q.name}</TableCell>
                    <TableCell>
                      <QuizActions>
                        <Button
                          appearance="primary"
                          title="View Quiz"
                          icon={<Eye20Regular />}
                          onClick={() => handleViewQuiz(q.id)}
                        />

                        <Button
                          appearance="primary"
                          title="Start Quiz"
                          icon={<Play20Regular />}
                          onClick={() => handleStartQuiz(q.id)}
                        />

                        <DeleteButton
                          title="Delete Quiz"
                          icon={<Delete20Regular />}
                          onClick={() => handleDeleteQuiz(q.id)}
                        />
                      </QuizActions>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </StyledTable>

      </Card>

      <Card style={{ margin: '24px', borderRadius: '10px', padding: '24px' }}>
        <Text size={500} weight="semibold">Completed Quizes</Text>
        <Text size={400}>Quizes already finished</Text>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ?
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner style={{ padding: '10px' }} label="Loading attempts..." size={SpinnerSize.medium} />
                </TableCell>
              </TableRow>
              : completedQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Text>No Quizes added yet.</Text>
                  </TableCell>
                </TableRow>
              ) : (
                completedQuizzes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.id}</TableCell>
                    <TableCell>
                      <QuizActions>
                        <Button
                          title="View Quiz"
                          appearance="primary"
                          icon={<Eye20Regular />}
                          onClick={() => handleViewAttempt(doc.category_id, doc.id)}
                        />

                        <DeleteButton
                          title="Delete Quiz"
                          icon={<Delete20Regular />}
                          onClick={() => handleDeleteAttempt(doc.id)}
                        />
                      </QuizActions>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </StyledTable>

      </Card>

      {isOpenGenerateDialog && id && <GenerateQuizDialog categoryId={id} isOpenGenerateDialog={isOpenGenerateDialog} setIsOpenGenerateDialog={setIsOpenGenerateDialog} onGenerateQuiz={handleGenerateQuiz} quizName={quizName} setQuizName={setQuizName} difficulty={difficulty} setDifficulty={setDifficulty} />}

      {loadingDialog && <LoadingDialog loadingDialog={loadingDialog} />}

      {confirmDelete && selectedDocumentId && <ConfirmDeleteDialog documentId={selectedDocumentId} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} onDeleteDocument={handleDeleteDocument} />}

      <Toaster />
      {isGeneratingQuiz && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        </div>
      )}
    </PageWrapper>
  );
};

export default Category;
