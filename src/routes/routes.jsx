import { useRoutes } from "react-router-dom";
import { Login } from "../auth/Login";
import AppLayout from "../layout/AppLayout";
import AuthLayout from "../layout/AuthLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Register from "../auth/Register";
import { DASHBOARD, LOGIN, REGISTER } from "./RoutesConstent";
import ProtectedRoute from "../protected-Routes/ProtectedRoutes";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [{ path: DASHBOARD, element: <Dashboard /> }],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: LOGIN, element: <Login /> },
        { path: REGISTER, element: <Register /> },
      ],
    },
  ]);
  return <>{routes}</>;
}
