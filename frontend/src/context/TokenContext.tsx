import React, { createContext, ReactNode, useState } from 'react'

type TokenContextType = {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}
export const TokenContext = createContext<TokenContextType>({
    token: null,
    setToken: () => { }

});

function TokenProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log('TokenProvider initialized with token:', token);
    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    )
}

export default TokenProvider
