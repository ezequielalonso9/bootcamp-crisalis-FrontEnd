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
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


type Color = 'success' | 'error' | 'info'
type KeyColor = 'Activo' | 'Baja' | 'Presupuesto'
type SetColor = { [key in KeyColor]: Color };
type CustomChipProps = { value: KeyColor }
type Row = {
  id: number;
  cliente: string;
  estado: string;
  fechaPedido: Date | null;
  fechaUltimaModificacion: Date | null;
  totalPedido: number;
}

const COLOR_CHIP: SetColor = {
  'Activo': 'success',
  'Baja': 'error',
  'Presupuesto': 'info',
}

const setColor = (value: KeyColor): Color => {
  return COLOR_CHIP[value]
}

const CustomChip = ({ value }: CustomChipProps) => {
  const color: Color = setColor(value)
  return <Chip variant="outlined" label={value} color={color} />
}



const pedidosToRows = (pedidos: Pedido[]) => {
  const rows: Row[] = []
  pedidos.forEach(pedido => {
    let row = pedidoToRow(pedido)
    rows.push(row)
  })
  return rows
}

const pedidoToRow = (pedido: Pedido) => {

  const { tipoCliente, cliente, id, fechaPedido, fechaUltimaModificacion, totalPedido, estado } = pedido
  let nombreCliente = ''

  if (tipoCliente === "Persona") {
    const { persona } = cliente
    const { nombre, apellido } = persona
    nombreCliente = `${nombre} ${apellido}`
  }
  if (cliente.empresa !== null) {
    nombreCliente = cliente.empresa.razonSocial;
  }

  let estadoPedido = 'Activo'
  if (estado === false) {
    estadoPedido = 'Baja'
  }
  if (estado === null) {
    estadoPedido = 'Presupuesto'
  }



  return {
    id,
    cliente: nombreCliente,
    estado: estadoPedido,
    fechaPedido,
    fechaUltimaModificacion,
    totalPedido
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
            navigate('/pedido')
          }}
        >
          crear Pedido
        </Button>
      </Box>
    </GridToolbarContainer>
  );
}

export function OrdersPage() {

  const [rows, setRows] = useState<GridRowsProp>()
  const { token } = handleToken()
  const navigate = useNavigate();

  const tokenFromStorage = useRef<string | null>()


  useEffect(() => {

    tokenFromStorage.current = token()

    axios.get("http://localhost:8080/pedidos",
      { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
      .then(resp => {
        console.log(resp.data)
        setRows(pedidosToRows(resp.data))
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
    const { id } = params.row


    axios.delete(`http://localhost:8080/pedido/${id}`,
      { headers: { Authorization: `Bearer ${tokenFromStorage.current}` } })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          rows && setRows(rows.filter((row) => row.id !== id));
        }

        if (response.status === 202) {
          rows && setRows(rows.map((row) => {
            if (row.id === id) {
              return {
                ...row,
                estado: 'Baja'
              }
            }
            return row

          }));
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

  const handleEdit = (params: GridRowParams) => {

    const { id } = params.row

    navigate(`/pedido/${id}`)
  }



  const columns: GridEnrichedColDef[] = [
    { field: 'id', headerName: '#Pedido', flex: 1 },
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    {
      field: 'fechaPedido', headerName: 'Fecha', flex: 1,
      type: 'date',
      valueFormatter: (params) => {
        return params.value ? (new Date(params.value)).toLocaleString() : '';
      }
    },
    // {
    //   field: 'fehcaUltimaModificacion', headerName: 'Fecha ult. modificacion', flex: 1,
    //   type: 'date',
    //   valueFormatter: (params) => {
    //     return params.value ? (new Date(params.value)).toLocaleDateString() : '';
    //   }
    // },
    {
      field: 'totalPedido',
      headerName: 'Monto total',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
    },
    {
      field: 'estado',
      headerName: 'Estado',
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
        />
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Box sx={{ height: 500, width: '100%', backgroundColor: 'white' }}>
        <Title margin={0} pading={2}>Pedidos</Title>
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