import { useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import {
    DataGrid,
    GridEnrichedColDef,
    GridRowId,
    GridRowsProp,
    GridSelectionModel,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

import Container from '@mui/material/Container';

import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from '../components/Title';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormControlLabel, FormGroup, Grid, Paper, Switch, TextField } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

interface ImpuestoRow {
    id: number,
    nombreImpuesto: string,
    valorImpuesto: number,
    idDb: number,
    isNew: boolean
}

const initialRows = [
    {
        id: Math.random,
        nombreImpuesto: null,
        valorImpuesto: null,
        idDb: null,
        isNew: null

    }
]

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

export function Producto() {

    const [inputValue, setInputValue] = useState({
        nombre: '',
        tipoProducto: 'Producto',
        costo: '',
        detalle: '',
        cargoAdicionalSoporte: '',
        estado: true
    })
    const [rows, setRows] = useState<GridRowsProp>(initialRows)
    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
    const [disableSubmit, setdisableSubmit] = useState(true)

    const { token } = handleToken()
    const navigate = useNavigate();
    let { id } = useParams();


    const tokenFromStorage = useRef<string | null>()

    const errorFetch = ({ response }: AxiosError) => {

        if (response?.status === 401) {
            navigate('/singIn', {
                replace: true
            })
        }
    }


    useEffect(() => {

        tokenFromStorage.current = token()

        if (id) {
            axios.get(`http://localhost:8080/prestacion/${id}`,
                { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
                .then(resp => {
                    const {
                        nombre,
                        costo,
                        detalle,
                        tipoPrestacion,
                        impuestosId,
                        cargoAdicionalSoporte,
                        estado
                    } = resp.data
                    console.log(resp.data)

                    setSelectionModel(impuestosId)
                    setInputValue({
                        nombre,
                        costo: `${costo}`,
                        detalle,
                        tipoProducto: tipoPrestacion,
                        cargoAdicionalSoporte,
                        estado
                    })

                }).catch(errorFetch)
        }

        axios.get<Impuesto[]>("http://localhost:8080/impuestos",
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then(resp => {
                const impuestos: Impuesto[] = resp.data
                const impuestoRow: ImpuestoRow[] = []

                impuestos.forEach(impuesto =>
                    impuestoRow.push(
                        {
                            ...impuesto,
                            idDb: impuesto.id,
                            isNew: false
                        }
                    ))
                setRows(impuestoRow)

            }).catch(errorFetch)
    }, [])

    useEffect(() => {
        validateSubmit()

    }, [selectionModel, inputValue])

    const inputValueIsOk = () => {


        const { costo, nombre } = inputValue

        if ( nombre !== '' && Number(costo) > 0 ){
            return true
        }

        return false
    }

    const validateSubmit = () => {

        const areThereImpuestos = selectionModel.length !== 0
        const isInputValueOk = inputValueIsOk()

        if (areThereImpuestos && isInputValueOk) {
            return setdisableSubmit(false)
        }
        setdisableSubmit(true)

    }




    const currencyFormatter = new Intl.NumberFormat('de-DE');

    const columns: GridEnrichedColDef[] = [
        { field: 'nombreImpuesto', headerName: 'Nombre', flex: 1, editable: true },
        {
            field: 'valorImpuesto',
            headerName: 'costo',
            flex: 1, editable: true,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            valueFormatter: ({ value }) => {
                const valueFormatted = currencyFormatter.format(value)
                return `${valueFormatted} %`
            }
        },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        })
    }

    interface RequestProducto {
        nombre: string,
        tipoProducto: string,
        costo: number,
        detalle: string,
        impuestosId: GridRowId[]
        estado: boolean
    }

    type RequestServicio = RequestProducto | { cargoAdicionalSoporte: number }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const impuestosId = selectionModel;

        let url = 'producto'
        const { nombre,
            tipoProducto,
            costo,
            detalle,
            cargoAdicionalSoporte,
            estado
        } = inputValue

        let body: RequestProducto | RequestServicio = {
            nombre,
            tipoProducto,
            costo: Number(costo),
            detalle,
            impuestosId,
            estado
        }

        if (tipoProducto === 'Servicio') {
            body = {
                ...body,
                cargoAdicionalSoporte: Number(cargoAdicionalSoporte)
            }
            url = 'servicio'
        }

        if (id) {

            axios.put(`http://localhost:8080/prestacion/${url}/${id}`,
                body,
                { headers: { Authorization: `Bearer ${token()}` } })
                .then(() => {
                    navigate('/prestaciones')
                }).catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/singIn', {
                            replace: true
                        })
                    }
                })



        } else {

            axios.post(`http://localhost:8080/prestacion/${url}`,
                body,
                { headers: { Authorization: `Bearer ${token()}` } })
                .then(() => {
                    navigate('/prestaciones')
                }).catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/singIn', {
                            replace: true
                        })
                    }
                })

        }



        console.log(JSON.stringify(body))
    }

    const handleChangeSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.checked
        })
    }



    return (
        <>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={7}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Title margin={0} pading={2}>Prestacion</Title>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <Grid container alignItems={'center'} spacing={3}>
                                    <Grid item xs={9} md={9} lg={9}>
                                        <TextField
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                            id="nombre"
                                            label="Nombre"
                                            name="nombre"
                                            value={inputValue.nombre}
                                            autoComplete="nombre"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={inputValue.estado} color='success' name={'estado'} onChange={handleChangeSwitch}/>
                                                }
                                                label={'activo'}
                                            />
                                        </FormGroup>

                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={4} md={4} lg={4}>
                                        <TextField
                                            onChange={handleChange}
                                            fullWidth
                                            select
                                            margin="normal"
                                            required
                                            disabled={!!id}
                                            id="tipoProducto"
                                            label="Tipo producto"
                                            name="tipoProducto"
                                            value={inputValue.tipoProducto}
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option key={'Producto'} value={'Producto'}>
                                                Producto
                                            </option>
                                            <option key={'Servicio'} value={'Servicio'}>
                                                Servicio
                                            </option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={4} md={4} lg={4}>
                                        <TextField
                                            onChange={handleChange}
                                            type={'number'}
                                            margin="normal"
                                            required
                                            id="costo"
                                            label="costo"
                                            name="costo"
                                            value={inputValue.costo}
                                        />
                                    </Grid>
                                    <Grid item xs={4} md={4} lg={4}>
                                        <TextField
                                            onChange={handleChange}
                                            type={'number'}
                                            margin="normal"
                                            required
                                            disabled={inputValue.tipoProducto === 'Producto'}
                                            id="cargoAdicionalSoporte"
                                            label="Adicional soporte"
                                            name="cargoAdicionalSoporte"
                                            value={inputValue.cargoAdicionalSoporte}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    onChange={handleChange}
                                    multiline
                                    rows={5}
                                    margin="normal"
                                    fullWidth
                                    name="detalle"
                                    label="detalle"
                                    id="detalle"
                                    value={inputValue.detalle}
                                />
                                <Button
                                    type="submit"
                                    disabled={disableSubmit}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Cargar Producto
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={5}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
                                <Title margin={0} pading={2}>Impuestos</Title>
                                <Box sx={{ height: 400, marginInline: 2 }}>
                                    {rows && <DataGrid
                                        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                        }}
                                        selectionModel={selectionModel}
                                        rows={rows}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        components={{
                                            Toolbar: CustomToolbar,
                                        }}
                                        checkboxSelection
                                    />}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>

    );
}
