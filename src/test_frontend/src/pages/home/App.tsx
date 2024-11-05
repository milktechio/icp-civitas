import { useAuthContext } from "../../context/hooks/useAuthContext";
import Login from "../../views/Login/Login";
import Voting from "../voting/Voting";

function App() {
  const auth = useAuthContext();

  return (
    <>
      <Login />
      <Voting />
    </>
  );
}

export default App;
