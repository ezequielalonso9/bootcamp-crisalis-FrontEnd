export const handleToken = () => {

    const setToken = (token: string) => localStorage.setItem("token", token)
    const token = () => {
        const token = localStorage.getItem("token")
        if( token ){
            return token
        }
        return ''
    }
    return {
        token,
        setToken
    }
    
}