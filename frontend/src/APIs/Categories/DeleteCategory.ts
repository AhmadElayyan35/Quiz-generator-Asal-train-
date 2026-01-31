export const DeleteCategory = async (apiFetch: ReturnType<typeof import("../../hooks/useApi").useApi>
    , categoryId: number) => {

    try {
        const response = await apiFetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`, {
            method: 'DELETE',
        });
        if(response){
             if (!response?.ok) {
            throw new Error('Network response was not ok');
        }
        }
       
    } catch (error) {
        console.error('Error during delete category:', error);
        throw error;
    }

}