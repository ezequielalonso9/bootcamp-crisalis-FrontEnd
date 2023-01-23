import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from '../components/Title';
import { Alert, Button, Container, Fab, FormControlLabel, FormGroup, Grid, Paper, Snackbar, Switch } from '@mui/material';
import { DataGridCustomer } from '../components/DataGridCustomer';
import { GridRowsProp } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { AlertDialog } from '../components/AlertDialog';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { rutasBackEnd } from '../types/enum';
import { DataGridCompany } from '../components/DataGridCompany';

type Error = {
    [key: string]: string
}

const { singIn, clientesPersona } = rutasBackEnd

const personRows: GridRowsProp = [
    { id: Math.random(), dni: null, nombre: null, apellido: null }
]
const companyRows: GridRowsProp = [
    { id: Math.random(), cuit: null, fechaInicioActividad: null, razonSocial: null }
];

export function CustomerPersonById() {

    const [rowsPerson, setRowsPerson] = useState(personRows)
    const [rowsCompany, setRowsCompany] = useState(companyRows)
    const [estado, setEstado] = useState(true)

    const [openError, setOpenError] = useState(false)
    const [addEmpresa, setAddEmpresa] = useState(false)
    const [visibleConfirmation, setVisibleConfirmation] = useState(false)
    const navigate = useNavigate();
    const { id } = useParams()


    let errors: Error[] = []



    useEffect(() => {

        const token = handleToken().token()

        axios.get<Cliente>(`http://localhost:8080/${clientesPersona}/${id}`,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(resp => {
                const { persona, estado } = resp.data
                setRowsPerson([{
                    id: Math.random(),
                    ...persona
                }])
                setEstado(estado)
            }).catch((error) => {

                if (error.response.status === 401) {
                    navigate(`/${singIn}`, {
                        replace: true
                    })
                }
            })

    }, [])




    const validateValues = () => {

        rowsPerson.forEach(row => {
            const keyValueArray = Object.entries(row)
            keyValueArray.forEach(([key, value]) => {
                if (value === null || value === '') {
                    errors.push({ [key]: 'no puede ser nulo' })
                }
            })
        })

        if (addEmpresa) {
            rowsCompany.forEach(row => {
                const keyValueArray = Object.entries(row)
                keyValueArray.forEach(([key, value]) => {
                    if (value === null || value === '') {
                        errors.push({ [key]: 'no puede ser nulo' })
                    }
                })
            })
        }

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
        const body = addEmpresa ? { persona, empresa, estado} : { persona , estado }

        console.log(`http://localhost:8080/cliente/persona/${id}`)
        console.log(body)


        axios.put(`http://localhost:8080/cliente/persona/${id}`,
            body,
            { headers: { Authorization: `Bearer ${handleToken().token()}` } })
            .then(() => {
                navigate(`/clientes`)
            }).catch((error) => {
                console.log(error.response.data)
                if (error.response.status === 401) {
                    navigate('/singIn', {
                        replace: true
                    })
                }
            })


    }

    const handleAddEmpresa = () => {
        setAddEmpresa(addEmpresa => !addEmpresa)
    }

    const handleChangeSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstado(e.target.checked)
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title margin={0} pading={2}>Persona</Title>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch checked={estado} color='success' name={'estado'} onChange={handleChangeSwitch} />
                                    }
                                    label={'activo'}
                                />
                            </FormGroup>
                        </Box>
                        <Box sx={{ marginInline: 2 }}>
                            <DataGridCustomer rows={rowsPerson} setRows={setRowsPerson} dniEditable={false}  />
                        </Box>
                    </Paper>
                </Grid>
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
                            <Button color="primary" startIcon={<AddIcon />} onClick={handleAddEmpresa}>
                                Aderir empresa
                            </Button>
                        </Box>
                        {
                            addEmpresa &&
                            <Box sx={{ marginInline: 2 }}>
                                <DataGridCompany rows={rowsCompany} setRows={setRowsCompany}  />
                            </Box>
                        }
                    </Paper>
                </Grid>
            </Grid>
            <Fab
                sx={{
                    position: 'absolute',
                    bottom: 25,
                    right: 25,
                }}
                color="warning"
                aria-label="add"
                size='small'
            >
                <EditIcon onClick={handleSubmit} />
            </Fab>


            <AlertDialog
                title={'Esta seguro de que quiere modificar el cliente ?'}
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