import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthcontext tiene que ser usado con provider");
  }
  return context;
};
