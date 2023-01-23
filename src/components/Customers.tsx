import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { DataGrid, GridActionsCellItem, GridEnrichedColDef, GridRowParams, GridRowsProp, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


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

    const navigate = useNavigate();

    return (
        <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </Box>
            <Box>
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                        navigate('/cliente/0')
                    }}
                >
                    crear cliente
                </Button>
            </Box>
        </GridToolbarContainer>
    );
}

export function Customers() {

    const [rows, setRows] = useState<GridRowsProp>()
    const { token } = handleToken()
    const navigate = useNavigate();

    const tokenFromStorage = useRef<string | null>()


    useEffect(() => {

        tokenFromStorage.current = token()

        axios.get<Customer[]>("http://localhost:8080/clientes",
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then(resp => {
                console.log(resp.data)
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

    const handleDelete = (params: GridRowParams) => {
        const { id, tipoCliente } = params.row


        let url = 'persona'

        if (tipoCliente === 'empresa') {
            url = 'empresa'
        }

        axios.delete(`http://localhost:8080/cliente/${url}/${id}`,
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    rows && setRows(rows.filter((row) => row.id !== id));
                }
            })
            .catch((error) => {

                if (error.response.status === 401) {
                    navigate('/singIn', {
                        replace: true
                    })
                }
            })

    }

    const handleEdit = (params: GridRowParams ) => {

        const { id, tipoCliente } = params.row

        let url = 'persona'

        if (tipoCliente === 'empresa') {
            url = 'empresa'
        }

        navigate(`/cliente/${url}/${id}`)
    }

    const columns: GridEnrichedColDef[] = [
        { field: 'id', headerName: 'Dni/Cuit', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        {
            field: 'estado', headerName: 'Estado', flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => <CustomChip value={params.value} />
        },
        {
            field: 'tipoCliente',
            headerName: 'Tipo cliente',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            renderCell: (params) => <CustomChip value={params.value} />
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.id}
                    icon={<DeleteIcon />}
                    label="Delete"
                    showInMenu
                    onClick={() => handleDelete(params)}
                />,
                <GridActionsCellItem
                    key={params.id}
                    icon={<EditIcon />}
                    label="Editar"
                    showInMenu
                    onClick={() => handleEdit(params)}
                />,
                <GridActionsCellItem
                    key={params.id}
                    icon={<AddCircleOutlineIcon />}
                    label="nuevo pedido"
                    showInMenu
                    onClick={() => console.log(`nuevo pedido ${params.id}`)}
                />
            ]
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
                <Title margin={0} pading={2}>Clientes</Title>
                <Box sx={{ height: 400, marginInline: 2 }}>
                    {rows && <DataGrid
                        disableSelectionOnClick
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
    );
}