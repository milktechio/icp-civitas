import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import Login from "../pages/home/App";
import NewVoting from "../pages/newVoting/NewVoting";
import SessionLayout from "../components/SessionLayout/SessionLayout";
import VotingHome from "../pages/votingHome/VotingHome";

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
        <SessionLayout />
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
