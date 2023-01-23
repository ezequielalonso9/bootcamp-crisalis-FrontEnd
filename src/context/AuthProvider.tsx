import { useMemo, useState } from "react"
import { AuthContext } from "./AuthContext"

interface Props {
    children: JSX.Element | JSX.Element[]
}
export const AuthProvider = ({ children }: Props) => {

    const [token, setToken] = useState<string>("");
    
    const value = useMemo(() => ({
        token, setToken
    }), [token]);

    return (
        <AuthContext.Provider value={ value }>
            {children}
        </AuthContext.Provider>
    )
}