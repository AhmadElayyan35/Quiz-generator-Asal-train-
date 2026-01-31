import { QuizQuestion } from "../../components/QuizGenerator/data/quiz";

export const GenerateQuiz = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>,categoryId:number,name:string,level:string,setQuestions:React.Dispatch<React.SetStateAction<QuizQuestion[]>>,setIndexName:React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}/quizzes/generate`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                level: level,
            }),
        });
        if(response){
        const data = await response?.json();
        const questions = data.questions;
        const indexName = data.index_name

        if (response?.status === 200) {
            setQuestions(questions);
            setIndexName(indexName);
        }

        if (!response?.ok) {
            throw new Error('Network response was not ok');
        }

        return data;
    }
    } catch (error) {
        console.error('Error during generate quiz:', error);
        throw error;
    }
}
