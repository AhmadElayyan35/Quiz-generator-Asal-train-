
export const DeleteAttempt = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, attemptId: number) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/attempts/${attemptId}`, {
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
        console.error('Error during delete attempt:', error);
    }
}
