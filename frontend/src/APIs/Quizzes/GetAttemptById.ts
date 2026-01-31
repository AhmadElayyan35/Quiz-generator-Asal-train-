
export const GetAttemptById = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, attemptId: number) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/attempts/${attemptId}`, {
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
        return data;

        }
      
    } catch (error) {
        console.error('Error during get attempt:', error);
        throw error;

    }
}
