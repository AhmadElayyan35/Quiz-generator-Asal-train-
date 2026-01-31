import { Category } from "../../components/Categories/Categories";
import { Document } from "../../components/Category/Category";
import { Quiz, QuizAttempt } from "../../components/QuizGenerator/data/quiz";

export const GetUserDetails = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, setUserName: React.Dispatch<React.SetStateAction<string>>, setCategories: React.Dispatch<React.SetStateAction<Category[]>>, setDocuments: React.Dispatch<React.SetStateAction<Document[]>>, setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>, setAttempts: React.Dispatch<React.SetStateAction<QuizAttempt[]>>) => {

    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/user/details`, {
            method: 'GET',
        });
        if(response){
        const data = await response.json();
        const categories = data.categories;
        const documents = data.documents;
        const quizzes = data.quizzes;
        const attempts = data.attempts;
        const userName = data.user.name;
        if (response.status === 200) {
            setCategories(categories);
            setDocuments(documents);
            setQuizzes(quizzes);
            setAttempts(attempts);
            setUserName(userName);
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return data;
    }
    } catch (error) {
        console.error('Error during get details:', error);
    }


}
