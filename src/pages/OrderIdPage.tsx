import { useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import {
    DataGrid,
    GridEnrichedColDef,
    GridRowId,
    GridRowsProp,
    GridSelectionModel,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

import Container from '@mui/material/Container';

import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from '../components/Title';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, FormControlLabel, FormGroup, Grid, Paper, Snackbar, Switch, TextField, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Order } from '../components/Order';
import { CustomersSelector } from '../components/CustomersSelector';


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
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

export interface ClientePedido {
    id: number,
    nombre: string,
    tipoCliente: string
}

const superToken = handleToken().token()


export function OrderIdPage() {

    const [inputValue, setInputValue] = useState({
        prestacion: '',
        date: new Date(),
        cantidad: 0,
        añosGarantia: 0,
        estado: false
    })

    const initialResumenPedido = {
        subTotalPedido: '',
        totalImpuestoIva: '',
        totalImpuestoIbb: '',
        totalOtrosImpuestos: '',
        descuentoTotal: '',
        totalPedido: ''
    }

    const [updateStado, setUpdateStado] = useState(false);
    const [lineaId, setLineaId] = useState(0)
    const [lineas, setLineas] = useState<Linea[]>()
    const [idPedido, setIdPedido] = useState('')
    const [resumenPedido, setResumenPedido] = useState(initialResumenPedido)
    const [rows, setRows] = useState<GridRowsProp>(initialRows)
    const [dataRows, setDataRows] = useState<Prestacion[]>()
    const [, setPrestacion] = useState<Prestacion>()
    const [selectionPrestacionId, setSelectionPrestacionId] = useState<GridRowId[]>([]);
    const [disableSubmit, setdisableSubmit] = useState(true)

    const [cliente, setCliente] = useState<ClientePedido>({
        id: 0,
        nombre: '',
        tipoCliente: ''
    })
    const [visibleClientes, setVisibleClientes] = useState(false)

    const [addLine, setAddLine] = useState(false)

    const [openError, setOpenError] = useState(false)


    const { token } = handleToken()
    const navigate = useNavigate();
    const { id } = useParams();


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

        axios.get("http://localhost:8080/prestaciones",
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then(resp => {
                setRows(resp.data)
                setDataRows(resp.data)
            }).catch(errorFetch)

        axios.get<Pedido>(`http://localhost:8080/pedido/${id}`,
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then(resp => {
                const { lineas, tipoCliente, cliente, estado, ...data } = resp.data
                setLineas(lineas)

                let nombreCliente = ''
                const customCliente = {
                    id: 0,
                    nombre: nombreCliente,
                    tipoCliente
                }

                if (tipoCliente === "Persona") {
                    const { persona } = cliente
                    const { nombre, apellido } = persona
                    nombreCliente = `${nombre} ${apellido}`
                    customCliente.nombre = nombreCliente
                    customCliente.id = persona.dni
                }
                if (cliente.empresa !== null) {
                    nombreCliente = cliente.empresa.razonSocial;
                    customCliente.nombre = nombreCliente
                    customCliente.id = cliente.empresa.cuit
                }

                setCliente(customCliente)
                setResumenPedido({
                    subTotalPedido: `${data.subTotalPedido}`,
                    totalImpuestoIva: `${data.totalImpuestoIva}`,
                    totalImpuestoIbb: `${data.totalImpuestoIbb}`,
                    totalOtrosImpuestos: `${data.totalOtrosImpuestos}`,
                    descuentoTotal: `${data.descuentoTotal}`,
                    totalPedido: `${data.totalPedido}`
                })
                setIdPedido(`${data.id}`)
                estado && setInputValue({
                    ...inputValue,
                    ['estado']: estado
                })
            }).catch(errorFetch)
    }, [])

    useEffect(() => {
        validateSubmit()

    }, [inputValue])


    const inputValueIsOk = () => {

        const { prestacion, cantidad, añosGarantia } = inputValue

        const cantidadOk = cantidad > 0
        const añosGarantiaOk = añosGarantia >= 0
        const prestacionOk = prestacion !== ''

        if (cantidadOk && añosGarantiaOk && prestacionOk) {
            return true
        }

        return false
    }

    const validateSubmit = () => {

        const isInputValueOk = inputValueIsOk()

        if (isInputValueOk) {
            return setdisableSubmit(false)
        }

        setdisableSubmit(true)
    }



    const currencyFormatter = new Intl.NumberFormat('de-DE');

    const columns: GridEnrichedColDef[] = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        {
            field: 'costo',
            headerName: 'Costo',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            valueFormatter: ({ value }) => {
                const valueFormatted = currencyFormatter.format(value)
                return `$ ${valueFormatted}`
            }
        },
        { field: 'tipoPrestacion', headerName: 'Tipo', flex: 1 },
        {
            field: 'cargoAdicionalSoporte',
            headerName: 'Adicional soporte',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            valueFormatter: ({ value }) => {
                if (isNaN(value)) {
                    return 'No aplica'
                }
                const valueFormatted = currencyFormatter.format(value)
                return `$ ${valueFormatted}`
            }
        }

    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        })
    }


    const redondear = (number: number | null) => {
        let numero = number ? number : 0
        let numberDecimal = numero * 1000;
        let numberSinDecimal = Math.trunc(numberDecimal)
        let numberRedondeado = numberSinDecimal / 1000
        return numberRedondeado
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()


        const { cantidad, añosGarantia, date } = inputValue
        const body = {
            idCliente: cliente.id,
            tipoCliente: cliente.tipoCliente,
            linea: {
                idPrestacion: selectionPrestacionId[0],
                cantidadPrestacion: cantidad,
                añosGarantia,
                fecha: date
            }
        }

        if (idPedido === '') {
            console.log("POST: http://localhost:8080/pedido/")
            axios.post<Pedido>(`http://localhost:8080/pedido/`,
                body,
                { headers: { Authorization: `Bearer ${token()}` } })
                .then((resp) => {

                    if (resp.status === 200) {
                        const { linea, ...data } = resp.data
                        setLineas([linea])
                        setResumenPedido({
                            subTotalPedido: `${redondear(data.subTotalPedido)}`,
                            totalImpuestoIva: `${redondear(data.totalImpuestoIva)}`,
                            totalImpuestoIbb: `${redondear(data.totalImpuestoIbb)}`,
                            totalOtrosImpuestos: `${redondear(data.totalOtrosImpuestos)}`,
                            descuentoTotal: `${redondear(data.descuentoTotal)}`,
                            totalPedido: `${redondear(data.totalPedido)}`
                        })
                        setIdPedido(`${data.id}`)
                    }

                }).catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/singIn', {
                            replace: true
                        })
                    }
                })
        } else if (idPedido !== '' && !updateStado) {
            axios.post<Pedido>(`http://localhost:8080/pedido/${idPedido}/linea`,
                body,
                { headers: { Authorization: `Bearer ${token()}` } })
                .then((resp) => {

                    if (resp.status === 200) {
                        const { linea, ...data } = resp.data
                        lineas && setLineas(lineas => {
                            return lineas && [...lineas, linea]
                        })
                        setResumenPedido({
                            subTotalPedido: `${data.subTotalPedido}`,
                            totalImpuestoIva: `${data.totalImpuestoIva}`,
                            totalImpuestoIbb: `${data.totalImpuestoIbb}`,
                            totalOtrosImpuestos: `${data.totalOtrosImpuestos}`,
                            descuentoTotal: `${data.descuentoTotal}`,
                            totalPedido: `${data.totalPedido}`
                        })
                        setIdPedido(`${data.id}`)
                    }

                }).catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/singIn', {
                            replace: true
                        })
                    }
                })
        } else {

            const body = {
                cantidadPrestacion: cantidad,
                añosGarantia
            }

            axios.put<Pedido>(`http://localhost:8080/pedido/${idPedido}/linea/${lineaId}`,
                body,
                { headers: { Authorization: `Bearer ${token()}` } })
                .then((resp) => {

                    if (resp.status === 200) {
                        const { linea, lineas, ...data } = resp.data
                        setLineas(lineas)
                        setResumenPedido({
                            subTotalPedido: `${data.subTotalPedido}`,
                            totalImpuestoIva: `${data.totalImpuestoIva}`,
                            totalImpuestoIbb: `${data.totalImpuestoIbb}`,
                            totalOtrosImpuestos: `${data.totalOtrosImpuestos}`,
                            descuentoTotal: `${data.descuentoTotal}`,
                            totalPedido: `${data.totalPedido}`
                        })
                        setUpdateStado(false)
                    }

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
        const confirmado = e.target.checked
        console.log(confirmado)
        if (idPedido !== '' && confirmado) {
            console.log(token())
            axios.post(`http://localhost:8080/pedido/${idPedido}`,
                {},
                { headers: { Authorization: `Bearer ${superToken}` } })
                .then(() => {

                })
                .catch((error) => {

                    console.log(error.response)

                    if (error.response.status === 401) {
                        navigate('/singIn', {
                            replace: true
                        })
                    }
                    if (error.response.status === 400) {

                        setInputValue({
                            ...inputValue,
                            [e.target.name]: false
                        })
                    }

                })

            setInputValue({
                ...inputValue,
                [e.target.name]: e.target.checked
            })
        }




    }



    const selectionPrestacion = (idPrestacion: GridSelectionModel) => {
        setSelectionPrestacionId(idPrestacion);
        const prestacionArr = dataRows?.filter(prestacion => prestacion.id === idPrestacion[0])
        const prestacion = prestacionArr ? prestacionArr[0] : null
        prestacion && setPrestacion(prestacion)
        prestacion ?
            setInputValue({
                ...inputValue,
                ['prestacion']: prestacion?.nombre
            })
            :
            setInputValue({
                ...inputValue,
                ['prestacion']: ''
            })

    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    return (
        <>
            <Toolbar />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Title margin={0} pading={0}>Pedido # {`${idPedido}`}</Title>

                            <Grid container justifyContent="space-between" alignItems={'center'} spacing={3}>

                                <Grid item xs={6} md={6} lg={6}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        required
                                        id="nombre"
                                        label="Cliente"
                                        name="nombre"
                                        variant="standard"
                                        value={cliente.nombre}
                                        onFocus={() => setVisibleClientes(true)}
                                    />
                                </Grid>
                                <Grid item justifyContent="flex-end" xs={6} md={6} lg={3}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={inputValue.estado}
                                                    color='success'
                                                    name={'estado'}
                                                    onChange={handleChangeSwitch} />
                                            }
                                            label={'Pedido activo'}
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>



                            {visibleClientes &&
                                <CustomersSelector
                                    visible={visibleClientes}
                                    setVisible={setVisibleClientes}
                                    setCliente={setCliente}
                                />
                            }




                            <Grid container item xs={6} md={6} lg={6}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Typography component="h3" variant="subtitle1" color="primary" gutterBottom>
                                        Resumen Pedido
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Subtotal:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.subTotalPedido}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Total impuestos Iva:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.totalImpuestoIva}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Total impuestos Ibb:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.totalImpuestoIbb}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Total otros impuestos:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.totalOtrosImpuestos}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Descuento:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.descuentoTotal}`}
                                    </Typography>
                                </Grid>
                                <Grid item justifyContent="flex-end" xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        Total:
                                    </Typography>
                                </Grid>
                                <Grid item justifyContent="flex-end" xs={6} md={6} lg={6}>
                                    <Typography component="h3" variant="body2" color="grey" gutterBottom>
                                        ${`${resumenPedido.totalPedido}`}
                                    </Typography>
                                </Grid>
                            </Grid>




                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {addLine === false ?
                                    <Button
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => setAddLine(!addLine)}
                                    >
                                        Agregar linea
                                    </Button>
                                    :
                                    <Button
                                        startIcon={<CloseIcon />}
                                        onClick={() => setAddLine(!addLine)}
                                    >
                                        Cerrar
                                    </Button>
                                }

                            </Box>

                            <Order
                                lineas={lineas}
                                idPedido={idPedido}
                                setLineas={setLineas}
                                setOpenError={setOpenError}
                                setUpdateStado={setUpdateStado}
                                setSelectionPrestacionId={setSelectionPrestacionId}
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                setLineaId={setLineaId}
                                setAddLine={setAddLine}
                            />
                        </Paper>
                    </Grid>


                    {
                        addLine &&
                        <>



                            <Grid item xs={4} md={4} lg={4}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 450
                                    }}
                                >
                                    <Title margin={0} pading={2}>Datos de pedido</Title>
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={12} lg={12}>
                                                <TextField
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                    required
                                                    disabled
                                                    id="prestacion"
                                                    label="Prestacion"
                                                    name="prestacion"
                                                    variant="standard"
                                                    value={inputValue.prestacion}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6}>
                                                <TextField
                                                    onChange={handleChange}
                                                    type={'number'}
                                                    margin="normal"
                                                    required
                                                    id="cantidad"
                                                    label="cantidad"
                                                    name="cantidad"
                                                    value={inputValue.cantidad}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6}>
                                                <TextField
                                                    onChange={handleChange}
                                                    type={'number'}
                                                    margin="normal"
                                                    required
                                                    id="añosGarantia"
                                                    label="Años de garantia"
                                                    name="añosGarantia"
                                                    value={inputValue.añosGarantia}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6}>
                                                <TextField
                                                    disabled={updateStado}
                                                    id="date"
                                                    label="date"
                                                    type="date"
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    name="date"
                                                    value={inputValue.date}
                                                />
                                            </Grid>

                                        </Grid>



                                        <Button
                                            type="submit"
                                            disabled={disableSubmit}
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            {updateStado ? 'Actualizar Linea' : 'Cargar Linea'}
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>



                            <Grid item xs={8} md={8} lg={8}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 450

                                    }}
                                >
                                    <Box sx={{ width: '100%', backgroundColor: 'white' }}>
                                        <Title margin={0} pading={2}> Prestaciones </Title>
                                        <Box sx={{ height: 350, marginInline: 2 }}>
                                            {rows && <DataGrid
                                                onSelectionModelChange={selectionPrestacion}
                                                selectionModel={selectionPrestacionId}
                                                rows={rows}
                                                columns={columns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10]}
                                                components={{
                                                    Toolbar: CustomToolbar,
                                                }}
                                                disableSelectionOnClick={updateStado}
                                            />}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </>

                    }

                </Grid>

                <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                        No se puede eliminar, el pedido esta confirmado
                    </Alert>
                </Snackbar>
            </Container>
        </>

    );
}
