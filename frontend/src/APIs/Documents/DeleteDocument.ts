
export const DeleteDocument = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, documentId: number) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/documents/${documentId}`, {
            method: 'DELETE',
        });
        if(response){
               if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        }

    } catch (error) {
        console.error('Error during delete document:', error);

        throw error;
    }



}