import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { Button, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ClientePedido } from '../pages/OrderPage';


type Color = 'success' | 'error' | 'info' | 'warning'
type KeyColor = 'true' | 'false' | 'persona' | 'empresa'
type SetColor = { [key in KeyColor]: Color };
type CustomChipProps = { value: KeyColor }
type Row = { estado: string; id: number; nombre: string; tipoCliente: string }

const COLOR_CHIP: SetColor = {
    'true': 'success',
    'false': 'error',
    'persona': 'info',
    'empresa': 'warning'
}

const setColor = (value: KeyColor): Color => {
    return COLOR_CHIP[value]
}

const CustomChip = ({ value }: CustomChipProps) => {
    const color: Color = setColor(value)
    return <Chip variant="outlined" label={value} color={color} />
}



const customersToRowsCustomer = (customers: Customer[]) => {
    const rows: Row[] = []
    customers.forEach(customer => {
        let row = customerToRow(customer)
        rows.push(row)
    })
    return rows
}

const customerToRow = (customer: Customer) => {
    if (customer.empresa === null) {
        return rowPersona(customer.persona, customer.estado)
    }
    return rowEmpresa(customer.empresa, customer.estado)
}

const rowPersona = (persona: Persona, estado: boolean): Row => {
    return {
        estado: estado ? 'true' : 'false',
        id: persona.dni,
        nombre: `${persona.nombre} ${persona.apellido}`,
        tipoCliente: 'persona'
    }
}

const rowEmpresa = (empresa: Empresa, estado: boolean): Row => {
    return {
        estado: estado ? 'true' : 'false',
        id: empresa.cuit,
        nombre: empresa.razonSocial,
        tipoCliente: 'empresa'
    }
}

function CustomToolbar() {

    return (
        <GridToolbarContainer >
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

export interface CustomerSelectorProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setCliente: React.Dispatch<React.SetStateAction<ClientePedido>>;
}

export function CustomersSelector({ visible, setVisible, setCliente }: CustomerSelectorProps) {

    const [rows, setRows] = useState<GridRowsProp>()
    const [dataRows, setDataRows] = useState<Row[]>()
    const { token } = handleToken()
    const navigate = useNavigate();
    const [selectionCustomerId, setSelectionCustomerId] = useState<GridRowId[]>([]);


    const tokenFromStorage = useRef<string | null>()


    useEffect(() => {

        tokenFromStorage.current = token()

        axios.get<Customer[]>("http://localhost:8080/clientes",
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then(resp => {
                console.log(resp.data)
                setDataRows(customersToRowsCustomer(resp.data))
                setRows(customersToRowsCustomer(resp.data))
            }).catch((error) => {

                if (error.response.status === 401) {
                    navigate('/singIn', {
                        replace: true
                    })
                    console.log(tokenFromStorage)
                    console.log("error.response.status = 401")
                }
            })
    }, [])





    const columns: GridEnrichedColDef[] = [
        { field: 'id', headerName: 'Dni/Cuit', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        {
            field: 'tipoCliente',
            headerName: 'Tipo cliente',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            renderCell: (params) => <CustomChip value={params.value} />
        }
    ];

    const selectionCustomer = (newSelectionModel: GridSelectionModel) => {
        setSelectionCustomerId(newSelectionModel);
        const clienteArr = dataRows?.filter(cliente => cliente.id === newSelectionModel[0])
        const cliente: Row | null = clienteArr ? clienteArr[0] : null
        cliente && setCliente(cliente)

    }

    return (

        <Fade in={visible}>
            <Container maxWidth="lg" sx={{ mt: 0, mb: 0 }}>
                <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title margin={0} pading={2}>Clientes</Title>
                        <Button
                            startIcon={<CloseIcon />}
                            onClick={() => setVisible(false)}
                        >Close
                        </Button>

                    </Box>
                    <Box sx={{ height: 400, marginInline: 2 }}>
                        {rows && <DataGrid
                            onSelectionModelChange={selectionCustomer}
                            selectionModel={selectionCustomerId}
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                        />}
                    </Box>
                </Box>
            </Container>
        </Fade>

    );
}