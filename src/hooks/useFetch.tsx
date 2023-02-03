import axios, {  AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const useFetch = (url: string, token: string) => {

    const navigate = useNavigate();

    const [state, setState] = useState({
        data: null,
        isLoading: true,
        hasError: null,
    })

    const getFetch = async () => {

        const configRequest: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${token}`}
        }

        try {

            const { data } = await axios.get(url, configRequest)

            setState({
                data,
                isLoading: false,
                hasError: null,
            });

        } catch( error){
            
            if ( axios.isAxiosError(error) && error.response?.status === 401 ) {
                navigate('/singIn', {
                    replace: true
                })
            }
        }

    }

    useEffect(() => {
        getFetch();
    }, [url])

    return {
        data: state.data,
        isLoading: state.isLoading,
        hasError: state.hasError,
    };
}