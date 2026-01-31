import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';

export function useApi() {
    const { token, setToken } = useContext(TokenContext);

    async function apiFetch(input: RequestInfo, init?: RequestInit) {
        const response = await fetch(input, {
            ...init,
            headers: {
                ...init?.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            setToken('');
            return null;
        }

        return response;
    }

    return apiFetch;
}
