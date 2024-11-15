import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import Login from "../pages/home/App";
import NewVoting from "../pages/admin/NewVoting";
import SessionLayout from "../components/SessionLayout/SessionLayout";
import VotingHome from "../pages/admin/VotingHome";
import { VotingProvider } from "../context/VotingContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/admin",
    element: (
      <AuthRoutes>
        <VotingProvider>
          <SessionLayout />
        </VotingProvider>
      </AuthRoutes>
    ),
    children: [
      {
        path: "voting",
        element: <NewVoting />,
      },
      {
        path: "home",
        element: <VotingHome />,
      },
    ],
  },
]);

export const RouterWrapped = () => {
  return <RouterProvider router={router} />;
};
