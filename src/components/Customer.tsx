import Container from '@mui/material/Container';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from './Title';
import { Alert, Fab, Grid, Paper, Snackbar } from '@mui/material';
import { DataGridCustomer } from './DataGridCustomer';
import { DataGridCompany } from './DataGridCompany';
import { GridRowsProp } from '@mui/x-data-grid';
import { useState } from 'react';
import CustomConfirmationDialog from './CustomConfirmationDialogs';
import { AlertDialog } from './AlertDialog';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Error = {
    [key: string]: string
}


const token = handleToken().token()

const personRows: GridRowsProp = [
    { id: Math.random(), dni: null, nombre: null, apellido: null }
]

const companyRows: GridRowsProp = [
    { id: Math.random(), cuit: null, fechaInicioActividad: null, razonSocial: null }
];


export function Customer() {

    const [rowsPerson, setRowsPerson] = useState(personRows)
    const [rowsCompany, setRowsCompany] = useState(companyRows)
    const [openError, setOpenError] = useState(false)
    const [visibleConfirmation, setVisibleConfirmation] = useState(false)
    const navigate = useNavigate();

    let errors: Error[] = []


    const options = [
        'persona',
        'empresa'
    ];
    const [tipoCliente, setTipoCliente] = useState(options[1]);



    const validateValues = () => {

        if (tipoCliente === 'empresa') {
            rowsCompany.forEach(row => {
                const keyValueArray = Object.entries(row)
                keyValueArray.forEach(([key, value]) => {
                    if (value === null) {
                        errors.push({ [key]: 'no puede ser nulo' })
                    }
                })
            })
        }

        rowsPerson.forEach(row => {
            const keyValueArray = Object.entries(row)
            keyValueArray.forEach(([key, value]) => {
                if (value === null) {
                    errors.push({ [key]: 'no puede ser nulo' })
                }
            })
        })

    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    const handleSubmit = async () => {

        validateValues()

        if (errors.length === 0) {
            setVisibleConfirmation(true)

        } else {
            setOpenError(true)
            console.log(errors)
        }

    }

    const handleConfirmation = () => {

        const { nombre, apellido, dni } = rowsPerson[0]
        const { cuit, fechaInicioActividad, razonSocial } = rowsCompany[0]
        const persona = { nombre, apellido, dni }
        const empresa = { cuit, fechaInicioActividad, razonSocial }

        let url = 'persona'
        let body
        body = { ...persona }

        if (tipoCliente === 'empresa') {
            url = "empresa"
            body = {
                persona,
                empresa
            }
        }



        console.log(body)
        
        axios.post(`http://localhost:8080/cliente/${url}`,
            body,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                navigate('/clientes')
            }).catch((error) => {
                if (error.response.status === 401) {
                    navigate('/singIn', {
                        replace: true
                    })
                }
            })


    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item sm={12} md={12} lg={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Title margin={0} pading={2}>Persona</Title>
                        <Box sx={{ marginInline: 2 }}>
                            <DataGridCustomer rows={rowsPerson} setRows={setRowsPerson} />
                        </Box>
                    </Paper>
                </Grid>
                {tipoCliente === 'empresa' &&
                    <Grid item sm={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Title margin={0} pading={2}>Empresa</Title>
                            <Box sx={{ marginInline: 2 }}>
                                <DataGridCompany rows={rowsCompany} setRows={setRowsCompany} />
                            </Box>
                        </Paper>
                    </Grid>
                }
            </Grid>
            <Fab
                sx={{
                    position: 'absolute',
                    bottom: 25,
                    right: 25,
                }}
                color="success"
                aria-label="add"
                size='small'
            >
                <AddIcon onClick={handleSubmit} />
            </Fab>

            <CustomConfirmationDialog
                value={tipoCliente}
                setValue={setTipoCliente}
                visible={true}
                options={options}
                message={'Que tipo de cliente quiere cargar?'} />

            <AlertDialog
                title={'Esta seguro de que quiere guardar el cliente ?'}
                visible={visibleConfirmation}
                setVisible={setVisibleConfirmation}
                onAgree={handleConfirmation}
            />

            <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    hay datos obligatorios sin completar
                </Alert>
            </Snackbar>
        </Container>
    );
}