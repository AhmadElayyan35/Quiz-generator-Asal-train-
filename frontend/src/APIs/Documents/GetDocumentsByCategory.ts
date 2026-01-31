import { Document } from "../../components/Category/Category";

export const GetDocumentsByCategory = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, categoryId: number, setDocuments: React.Dispatch<React.SetStateAction<Document[]>>) => {

    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}/documents`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });
        if(response){
             const data = await response?.json();
        if (response?.status === 200) {
            setDocuments(data);
        }
        if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        return data;

        }

    } catch (error) {
        console.error('Error during get document:', error);
        throw error;
    }
}
