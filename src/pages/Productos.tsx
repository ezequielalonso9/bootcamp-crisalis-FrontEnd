import { useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import {
    DataGrid,
    GridActionsCellItem,
    GridEnrichedColDef,
    GridRowId,
    GridRowParams,
    GridRowsProp,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';


const initialRows = [
    {
        id: Math.random,
        nombre: null,
        costo: null,
        tipoPrestacion: null,
        estado: null,
        cargoAdicionalSoporte: null
    }
]


function CustomToolbar() {

    const navigate = useNavigate();

    const handleAddPrestacion = () => {
        navigate('/prestacion')
    };

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
                    onClick={handleAddPrestacion}
                >
                    Crear Prestacion
                </Button>
            </Box>
        </GridToolbarContainer>
    );
}

export function Productos() {

    const [rows, setRows] = useState<GridRowsProp>(initialRows)


    const { token } = handleToken()
    const navigate = useNavigate();

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

            }).catch(errorFetch)
    }, [])




    const handleDelete = (params: GridRowParams) => {

        const { id } = params.row

        axios.delete(`http://localhost:8080/prestacion/${id}`,
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then((response) => {
                console.log(response.status)
                if (response.status === 200) {
                    rows && setRows(rows.filter((row) => row.id !== id));
                }

                if (response.status === 204) {
                    rows && setRows(rows.map((row) => {
                        if (row.id === id) {
                          return {
                            ...row,
                            estado: 'baja'
                          }
                        }
                        return row
            
                      }));
                }
            })
            .catch(errorFetch)

    }

    const handleEditClick = (id: GridRowId) => () => {
        navigate(`/prestacion/${id}`)
    };

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
        },
        {
            field: 'estado',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) => {
                const { value } = params
                const color = value ? 'success' : 'error'
                return <Chip variant="outlined" label={value? 'activo' : 'baja'} color={color} />
            }

        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {

                return [
                    <GridActionsCellItem
                        key={params.id}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params.id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={params.id}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDelete(params)}
                        color="inherit"
                    />
                ];
            }
        }
    ];




    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
                <Title margin={0} pading={2}>Prestaciones</Title>
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