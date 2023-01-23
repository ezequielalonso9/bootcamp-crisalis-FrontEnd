import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import { Navbar } from '../components/Navbar';
import { MainContent } from '../components/MainContent';



const mdTheme = createTheme();

export default function Layout() {


    
    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <MainContent />
            </Box>
        </ThemeProvider>
    );
}
