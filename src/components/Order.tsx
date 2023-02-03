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

function createData(
    linea: number,
    producto: string,
    tipo: string,
    cantidadProducto: number,
    costo: number,
    costoSoporte: number,
    añosGarantia: number,
    costoTotalLinea: number | null,
) {
    return {
        linea,
        producto,
        tipo,
        cantidadProducto,
        costo,
        costoSoporte,
        añosGarantia,
        costoTotalLinea,
        impuestos: [
            {
                nombre: 'IVA',
                valor: 21,
            },
            {
                nombre: 'ICBB',
                valor: 13,
            }
        ]
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

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
                    {row.linea}
                </TableCell>
                <TableCell align="right">{row.producto}</TableCell>
                <TableCell align="right">{row.tipo}</TableCell>
                <TableCell align="right">{row.cantidadProducto}</TableCell>
                <TableCell align="right">{row.costo}</TableCell>
                <TableCell align="right">{row.costoSoporte}</TableCell>
                <TableCell align="right">{row.añosGarantia}</TableCell>
                <TableCell align="right">{row.costoTotalLinea}</TableCell>
                <TableCell align='center'>
                    <IconButton color="success" aria-label="edit" size="small">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton color="error" aria-label="delete" size="small">
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
                                            <TableRow key={impuesto.nombre}>
                                                <TableCell component="th" scope="row">
                                                    {impuesto.nombre}
                                                </TableCell>
                                                <TableCell>{impuesto.valor}</TableCell>
                                                <TableCell align="right">{Math.fround(impuesto.valor * row.costo / 100)}</TableCell>
                                            </TableRow>
                                        ))}

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
                {true && <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                    {
                                        row.impuestos.map((impuesto) => (
                                            <TableRow key={impuesto.nombre}>
                                                <TableCell component="th" scope="row">
                                                    {impuesto.nombre}
                                                </TableCell>
                                                <TableCell>{impuesto.valor}</TableCell>
                                                <TableCell align="right">{Math.fround(impuesto.valor * row.costo / 100)}</TableCell>
                                            </TableRow>
                                        ))}

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>}
            </TableRow>
        </React.Fragment>
    );
}

const rows = [
    createData(1, 'teclado', 'Producto', 2, 50, 0, 4, null),
];

const customPaper = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
    <Paper
        elevation={3}
    >
      {props.children}
    </Paper>
  );

export function Order() {
    return (
        <TableContainer component={customPaper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>#Linea</TableCell>
                        <TableCell align="right">Producto</TableCell>
                        <TableCell align="right">Tipo</TableCell>
                        <TableCell align="right">Cantidad Producto</TableCell>
                        <TableCell align="right">Costo</TableCell>
                        <TableCell align="right">Costo soporte</TableCell>
                        <TableCell align="right">Años garantia</TableCell>
                        <TableCell align="right">Fecha</TableCell>
                        <TableCell align="right">Costo total linea  ($)</TableCell>
                        <TableCell align="center">Accion</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.linea} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}