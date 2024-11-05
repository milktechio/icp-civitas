import { useAuthContext } from "../../context/hooks/useAuthContext";

const Voting = () => {
  const auth = useAuthContext();
  return <>{auth.isAuthenticated && <div>Voting</div>}</>;
};

export default Voting;
