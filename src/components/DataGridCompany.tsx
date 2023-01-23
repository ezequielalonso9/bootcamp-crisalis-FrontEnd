import { useState } from 'react'
import {
    GridRowModesModel,
    GridRowParams,
    MuiEvent,
    GridEventListener,
    GridRowModel,
    GridRowModes,
    GridRowId,
    GridEnrichedColDef,
    GridActionsCellItem,
    DataGrid,
    GridValidRowModel
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

type DataGridCompanyProps = {
    rows: readonly GridValidRowModel[],
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>,
    cuiEditable?: boolean,
    setIsUpdated?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DataGridCompany = ({ rows, setRows, cuiEditable = true, setIsUpdated }: DataGridCompanyProps) => {

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

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
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setIsUpdated && setIsUpdated(true)
        return updatedRow;
    };

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

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };


    const currencyFormatter = new Intl.NumberFormat('de-DE');


    const companyColums: GridEnrichedColDef[] = [
        { field: 'razonSocial', headerName: 'Razon social', flex: 1, editable: true },
        {
            field: 'cuit',
            headerName: 'Cuit',
            flex: 1,
            editable: cuiEditable,
            type: 'number',
            valueFormatter: ({ value }) => currencyFormatter.format(value),

        },
        { field: 'fechaInicioActividad', headerName: 'Fecha inicio actividad', type: 'date', flex: 1, editable: true },
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
                    />
                ];
            }
        }
    ];

    return (
        <>
            <DataGrid
                rowModesModel={rowModesModel}
                onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                editMode="row"
                disableSelectionOnClick
                autoHeight
                rows={rows}
                columns={companyColums}
                experimentalFeatures={{ newEditingApi: true }}
                hideFooterPagination
            />
        </>
    )
}
