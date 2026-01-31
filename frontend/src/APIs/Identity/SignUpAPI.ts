import React from 'react'

export const SignUpAPI = async ({ name, email, password }: { name: string, email: string, password: string }, setError: React.Dispatch<React.SetStateAction<string>>, setSuccess:
    React.Dispatch<React.SetStateAction<boolean>>
) => {

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            })
        });
        console.log(response);
        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            setSuccess(true);
            setError('');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }

    } catch (error) {
        console.error('Error:', error);
        setSuccess(false);
        setError('Email already exist')
    }
}
