
export const DeleteQuiz = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, quizId: number) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'accept': ' */*',
            },
        });
        if(response){
             if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        }

    } catch (error) {
        console.error('Error during delete quiz:', error);
        throw error;
    }
}
