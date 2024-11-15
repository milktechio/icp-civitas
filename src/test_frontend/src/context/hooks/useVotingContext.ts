import { useContext } from "react";
import { VotingContext } from "../VotingContext";

export const useVotingContext = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error("useAuthcontext tiene que ser usado con provider");
  }
  return context;
};
