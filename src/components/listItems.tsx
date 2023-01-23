import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BalanceIcon from '@mui/icons-material/Balance';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
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
    {/* <ListItemButton>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItemButton> */}
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Usuarios" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);