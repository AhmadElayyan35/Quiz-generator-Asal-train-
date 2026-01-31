import { QuizQuestion } from "../../components/QuizGenerator/data/quiz";

export const SaveQuiz = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, categoryId: number, quizName: string, difficulty: string, indexName: string, quiz: QuizQuestion[]) => {
    console.log(categoryId, quizName, difficulty, indexName, quiz);
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}/quizzes`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
            body: JSON.stringify({
                name: quizName,
                level: difficulty,
                index_name: indexName,
                questions: quiz
            }),
        });
        if(response){
             if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;

        }

       
    } catch (error) {
        console.error('Error during save quiz:', error);
        throw error;
    }
}
