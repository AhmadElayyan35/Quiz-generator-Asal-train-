import { QuizQuestion } from "../../components/QuizGenerator/data/quiz";

export const RegenerateQuestion = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, name: string, level: string, reason: string, questionNumber: number, questions: QuizQuestion[]) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/quizzes/questions/regenerate`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                index_name: name,
                difficulty: level,
                question_number: questionNumber,
                user_prompt: reason,
                questions: questions
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
        console.error('Error during regenerate question:', error);
        throw error;
    }
}
