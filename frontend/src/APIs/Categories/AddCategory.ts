export const AddCategory = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>, category: string) => {
    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
            body: JSON.stringify({
                name: category,
            }),
        });
        if(response){
             if (!response?.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response?.json();
        return data;

        }

       
    } catch (error) {
        console.error('Error during adding category:', error);
        throw error;
    }
}
