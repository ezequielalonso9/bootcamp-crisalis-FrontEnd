import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleToken } from '../hooks/handleToken';
import { GridRowId } from '@mui/x-data-grid';


const token = handleToken().token()

type InputValue = {
    prestacion: string;
    date: Date;
    cantidad: number;
    añosGarantia: number;
    estado: boolean;
}

function Row(props: {
    row: Linea, idPedido: string,
    setLineas: React.Dispatch<React.SetStateAction<Linea[] | undefined>>,
    setOpenError: React.Dispatch<React.SetStateAction<boolean>>
    setUpdateStado: React.Dispatch<React.SetStateAction<boolean>>
    setSelectionPrestacionId: React.Dispatch<React.SetStateAction<GridRowId[]>>
    inputValue: InputValue
    setInputValue: React.Dispatch<React.SetStateAction<InputValue>>
    setLineaId: React.Dispatch<React.SetStateAction<number>>
    setAddLine: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const {
        row,
        idPedido,
        setLineas,
        setOpenError,
        setUpdateStado,
        setSelectionPrestacionId,
        setInputValue,
        inputValue,
        setLineaId,
        setAddLine
    } = props;

    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();


    const handleEdit = () => {
        setUpdateStado(true)
        const idPrestacion: GridRowId = row.idPrestacion
        setSelectionPrestacionId([idPrestacion])
        setInputValue({
            ...inputValue,
            ['prestacion']: row.nombrePrestacion,
            ['cantidad']: row.cantidadPrestacion,
            ['añosGarantia']: row.añosGarantia? row.añosGarantia : 0
        })
        setLineaId(row.id)
        setAddLine(true)
    }

    const handleDelete = (idPedido: string) => {

        console.log(`delete linea id: ${row.id} pedido:${idPedido}`)


        axios.delete(`http://localhost:8080/pedido/${idPedido}/linea/${row.id}`,
            { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setLineas(lineas => lineas?.filter(linea => linea.id !== row.id))
                }
            })
            .catch((error) => {

                console.log(error.response)

                if (error.response.status === 401) {
                    navigate('/singIn', {
                        replace: true
                    })
                }

                if (error.response.status === 400) {
                    setOpenError(true)
                }
            })

    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell align="right">{row.nombrePrestacion}</TableCell>
                <TableCell align="right">{row.tipoPrestacion}</TableCell>
                <TableCell align="right">{row.cantidadPrestacion}</TableCell>
                <TableCell align="right">{row.costoUnitarioPrestacion}</TableCell>
                <TableCell align="right">{row.costoUnitarioSoporte}</TableCell>
                <TableCell align="right">{row.costoUnitarioSoporte}</TableCell>
                <TableCell align="right">{row.costoAdicionalGarantia}</TableCell>
                {
                    row.fecha !== null ?
                        <TableCell align="right">{new Date(row.fecha).toLocaleString()}</TableCell>
                        :
                        <TableCell align="right">{'N/A'}</TableCell>

                }
                {
                    row.fechaUltimaModificacion !== null ?
                        <TableCell align="right">{new Date(row.fechaUltimaModificacion).toLocaleString()}</TableCell>
                        :
                        <TableCell align="right">{'N/A'}</TableCell>

                }
                <TableCell align="right">{row.descuento}</TableCell>
                <TableCell align="right">{row.costoTotalLinea}</TableCell>
                <TableCell align='center'>
                    <IconButton onClick={handleEdit} color="success" aria-label="edit" size="small">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(idPedido)} color="error" aria-label="delete" size="small">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Impuestos
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Valor(%)</TableCell>
                                        <TableCell align="right">Impuesto del Producto($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        row.impuestos.map((impuesto) => (
                                            <TableRow key={impuesto.id}>
                                                <TableCell component="th" scope="row">
                                                    {impuesto.nombreImpuesto}
                                                </TableCell>
                                                <TableCell>{impuesto.valorImpuesto}</TableCell>
                                                <TableCell align="right">{impuesto.valorAdicional}</TableCell>
                                            </TableRow>
                                        ))}

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
                {row.añosGarantia === null || row.añosGarantia === 0 ? '' :
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Garantia
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cantidad de años</TableCell>
                                            <TableCell>Recargo por año(%)</TableCell>
                                            <TableCell align="right">Total recargo($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.añosGarantia}
                                            </TableCell>
                                            <TableCell>{row.costoUnitarioGarantia}</TableCell>
                                            <TableCell align="right">{row.costoAdicionalGarantia}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>}
            </TableRow>
        </React.Fragment>
    );
}


type OrderProps = {
    lineas: Linea[] | undefined
    idPedido: string,
    setLineas: React.Dispatch<React.SetStateAction<Linea[] | undefined>>
    setOpenError: React.Dispatch<React.SetStateAction<boolean>>
    setUpdateStado: React.Dispatch<React.SetStateAction<boolean>>
    setSelectionPrestacionId: React.Dispatch<React.SetStateAction<GridRowId[]>>
    inputValue: InputValue
    setInputValue: React.Dispatch<React.SetStateAction<InputValue>>
    setLineaId: React.Dispatch<React.SetStateAction<number>>
    setAddLine: React.Dispatch<React.SetStateAction<boolean>>
}

export function Order({
    lineas,
    idPedido,
    setLineas,
    setOpenError,
    setUpdateStado,
    setSelectionPrestacionId,
    inputValue,
    setInputValue,
    setLineaId,
    setAddLine
}: OrderProps) {
    return (
        <TableContainer component={Paper}>
            <Table size='small' aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell size='small' />
                        <TableCell size='small'>#Linea</TableCell>
                        <TableCell size='small' align="right">Producto</TableCell>
                        <TableCell size='small' align="right">Tipo</TableCell>
                        <TableCell size='small' align="right">cantidad</TableCell>
                        <TableCell size='small' align="center">Costo product</TableCell>
                        <TableCell size='small' align="center">Unitario soporte</TableCell>
                        <TableCell size='small' align="center">Total soporte</TableCell>
                        <TableCell size='small' align="center">Total garantia</TableCell>
                        <TableCell size='small' align="right">Fecha</TableCell>
                        <TableCell size='small' align="center">Fecha modificacion</TableCell>
                        <TableCell size='small' align="right">Descuento($)</TableCell>
                        <TableCell size='small' align="center">total($)</TableCell>
                        <TableCell size='small' align="center">Accion</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lineas && lineas.map((linea) => (
                        <Row
                            key={linea.id}
                            row={linea}
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}