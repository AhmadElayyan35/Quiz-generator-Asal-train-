import { NavigateFunction } from "react-router-dom";

export const LoginAPI = async ({ email, password }: { email: string, password: string }, setToken: React.Dispatch<React.SetStateAction<string | null>>, setError: React.Dispatch<React.SetStateAction<string>>, setSuccess: React.Dispatch<React.SetStateAction<boolean>>, navigate: NavigateFunction) => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);
    formData.append('password', password);
    formData.append('client_id', 'string');
    formData.append('client_secret', 'string');

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            setToken(data.access_token);
            setSuccess(true);
            setError('');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } else {
            throw new Error('Login failed');
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        setSuccess(false);
        setError('Invalid email or password');
    }
};