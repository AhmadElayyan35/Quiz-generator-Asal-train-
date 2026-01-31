import { Quiz } from "../../components/QuizGenerator/data/quiz";

export const GetQuizzesByCategoryId = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, categoryId: number, setAvailableQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}/quizzes`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });
        if(response){
             if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response?.json();
        setAvailableQuizzes(data);
        return data;

        }

       
    } catch (error) {
        console.error('Error during get quizes:', error);
        throw error;
    }
}
