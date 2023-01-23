import { useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import { DataGrid, GridActionsCellItem, GridEnrichedColDef, GridEventListener, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowParams, GridRowsProp, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridValidRowModel, MuiEvent } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';

import { handleToken } from '../hooks/handleToken';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Snackbar } from '@mui/material';

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

interface CustomToobarProps {
    rows: readonly GridValidRowModel[],
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}



function CustomToolbar(props: CustomToobarProps) {

    const { setRows, setRowModesModel } = props;

    const handleAddImpuesto = () => {
        const id = Math.random()
        setRows((oldRows) => [...oldRows, { id, nombreImpuesto: '', valorImpuesto: null, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombreImpuesto' },
        }));
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
                    onClick={handleAddImpuesto}
                >
                    Crear Impuesto
                </Button>
            </Box>
        </GridToolbarContainer>
    );
}

export function Impuestos() {

    const [rows, setRows] = useState<GridRowsProp>(initialRows)

    const [openError, setOpenError] = useState(false)

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});


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




    const handleDelete = (params: GridRowParams) => {

        const { id, idDb } = params.row


        axios.delete(`http://localhost:8080/impuesto/${idDb}`,
            { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
            .then((response) => {
                if (response.status === 200) {
                    rows && setRows(rows.filter((row) => row.id !== id));
                }
                if(response.status === 204 ){
                    setOpenError(true)
                    console.log("no se puede borrar porque esta usado por un producto")
                }
            })
            .catch(errorFetch)

    }

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const currencyFormatter = new Intl.NumberFormat('de-DE');

    const handleSaveClick = (params: GridRowParams) => () => {

        setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const columns: GridEnrichedColDef[] = [
        { field: 'nombreImpuesto', headerName: 'Nombre', flex: 1, editable: true },
        {
            field: 'valorImpuesto',
            headerName: 'Valor',
            flex: 1, editable: true,
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            valueFormatter: ({ value }) => {
                const valueFormatted = currencyFormatter.format(value)
                return `${valueFormatted} %`
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={params.id}
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(params)}
                        />,
                        <GridActionsCellItem
                            key={params.id}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(params.id)}
                            color="inherit"
                        />,
                    ];
                }

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

    const handleRowEditStart = (
        _params: GridRowParams,
        event: MuiEvent<React.SyntheticEvent>,
    ) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (_params, event) => {
        event.defaultMuiPrevented = true;
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const { nombreImpuesto, valorImpuesto, idDb, isNew, id } = newRow

        const body = {
            nombreImpuesto,
            valorImpuesto
        }

        if (isNew) {

            console.log(`POST: Body: ${JSON.stringify(body)}`)
            axios.post(
                `http://localhost:8080/impuesto`,
                body,
                { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } }
            )
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        const idDb = response.data
                        rows.map(row => row.id === id ?
                            {
                                ...row,
                                idDb,
                                isNew: false
                            } :
                            row
                        )
                    } else {
                        handleCancelClick(id);
                    }
                })
                .catch(errorFetch)

        } else {
            console.log(`PUT/${idDb} Body: ${JSON.stringify(body)}`)

            axios.put(
                `http://localhost:8080/impuesto/${idDb}`,
                body,
                { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } }
            )
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
                    } else {
                        handleCancelClick(id);
                    }
                })
                .catch(errorFetch)

        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
                <Title margin={0} pading={2}>Impuestos</Title>
                <Box sx={{ height: 400, marginInline: 2 }}>
                    {rows && <DataGrid
                        disableSelectionOnClick
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                        onRowEditStart={handleRowEditStart}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        editMode="row"
                        experimentalFeatures={{ newEditingApi: true }}
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        componentsProps={{
                            toolbar: { rows, setRows, setRowModesModel },
                        }}
                    />}
                </Box>
            </Box>
            
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                   No se puede eliminar, este impuesto esta relacionado con una prestacion
                </Alert>
            </Snackbar>
        </Container>
    );
}