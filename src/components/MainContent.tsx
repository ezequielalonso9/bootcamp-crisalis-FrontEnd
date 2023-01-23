import { useContext } from 'react';

import Box from '@mui/material/Box';
import { Outlet, useOutletContext } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';


export const MainContent = () => {

    const { token } = useContext(AuthContext)

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <Outlet context={{ token }}/>
        </Box>
    )
}

export function useToken() {
    return useOutletContext<AuthContextProps>();
  }