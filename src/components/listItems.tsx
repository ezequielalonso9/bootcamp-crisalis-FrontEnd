import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BalanceIcon from '@mui/icons-material/Balance';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';


const linkStyle = {
  textDecoration: "none",
  color: "inherit"
}

export const mainListItems = (
  <React.Fragment>
    <Tooltip title="Dashboard" placement="right" arrow>
      <NavLink
        to={`/dashboard`}
        style={linkStyle}
      >
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </NavLink>
    </Tooltip>
    <Tooltip title="Clientes" placement="right" arrow>
      <NavLink
        to={`/clientes`}
        style={linkStyle}

      >
        <ListItemButton>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItemButton>
      </NavLink>
    </Tooltip>
    <Tooltip title="Prestaciones" placement="right" arrow>
      <NavLink
        to={`/prestaciones`}
        style={linkStyle}

      >
        <ListItemButton>
          <ListItemIcon>
            <WidgetsIcon />
          </ListItemIcon>
          <ListItemText primary="Prestaciones" />
        </ListItemButton>
      </NavLink>
    </Tooltip>
    <Tooltip title="Impuestos" placement="right" arrow>
      <NavLink
        to={`/impuestos`}
        style={linkStyle}

      >
        <ListItemButton>
          <ListItemIcon>
            <BalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Impuestos" />
        </ListItemButton>
      </NavLink>
    </Tooltip>


    <Tooltip title="Pedidos" placement="right" arrow>
      <NavLink
        to={`/pedidos`}
        style={linkStyle}

      >
        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Pedidos" />
        </ListItemButton>
      </NavLink>
    </Tooltip>




    <Tooltip title="Reportes" placement="right" arrow>
      <NavLink
        to={`/reportes`}
        style={linkStyle}

      >
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reportes" />
        </ListItemButton>
      </NavLink>
    </Tooltip>




    {/*     <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Usuarios" />
    </ListItemButton> */}
  </React.Fragment>
);

