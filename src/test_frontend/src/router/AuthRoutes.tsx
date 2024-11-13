import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/hooks/useAuthContext";

const AuthRoutes = ({ children }: any) => {
  const auth = useAuthContext();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthRoutes;
