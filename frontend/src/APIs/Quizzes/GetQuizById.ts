import { QuizInfo, QuizQuestion } from "../../components/QuizGenerator/data/quiz";

export const GetQuizById = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, categoryId: number, quizId: number, setQuiz: React.Dispatch<React.SetStateAction<QuizInfo | null>>, setQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/{category_id}/quizzes/${quizId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });
        if(response){
            if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const quiz: QuizInfo = {
            id: data.id,
            name: data.name,
            level: data.level,
            path: data.path,
            category_id: data.category_id,
            created_at: data.created_at,
            questions: data.questions || [],
        };

        setQuiz(quiz);
        setQuestions(data.questions)
        return data;

        }
        
    } catch (error) {
        console.error('Error during get quiz:', error);
        throw error;
    }
}
