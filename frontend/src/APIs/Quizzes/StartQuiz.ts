export const StartQuiz = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, indexName: string) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/quizzes/start?indexName=${indexName}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
        });
        if(response){
              if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;

        }
    } catch (error) {
        console.error('Error during start quiz:', error);
        throw error;
    }
}
