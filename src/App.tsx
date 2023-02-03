import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './pages/Layout';
import SignIn from './pages/SingIn';
import { Dashboard } from './components/Dashboard';
import { Customers } from './components/Customers';
import { AuthProvider } from './context/AuthProvider'
import { Customer } from "./components/Customer";
import { CustomerPersonById } from "./pages/CustomerPersonById";
import { CustomerCompanyById } from "./pages/CustomerCompanyById";
import { Impuestos } from "./pages/Impuestos";
import { Producto } from "./pages/Producto";
import { Productos } from "./pages/Productos";
import { OrderPage } from "./pages/OrderPage";
import { OrdersPage } from "./pages/OrdersPage";

const router = createBrowserRouter([
  {
    path: "/singIn",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path:"/clientes",
        element: <Customers />
      },
      {
        path:"/cliente/:id",
        element: <Customer />
      },
      {
        path:"cliente/persona/:id",
        element: <CustomerPersonById />
      },
      {
        path: "cliente/empresa/:id",
        element: <CustomerCompanyById />
      },
      {
        path: "/prestacion",
        element: <Producto />
      },
      {
        path: "/prestaciones",
        element: <Productos />
      },
      {
        path:"/prestacion/:id",
        element: <Producto />
      },
      {
        path: "impuestos",
        element: <Impuestos />
      },
      {
        path: "pedido",
        element: <OrderPage />
      },
      {
        path: "pedidos",
        element: <OrdersPage />
      }
    ],
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
