import { Answer } from "../../components/QuizGenerator/data/quiz";

export const SubmitQuizAttempt = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, categoryId: number, answers: Answer[]) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/attempts`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
            body: JSON.stringify({
                category_id: categoryId,
                answers: answers
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
        console.error('Error during submit quiz:', error);
        throw error;
    }
}
