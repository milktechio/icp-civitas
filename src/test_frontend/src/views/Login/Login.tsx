import { useContext } from "react";
import LoginLayOut from "../../components/LoginLayOut/LoginLayOut";
import { useAuthContext } from "../../context/hooks/useAuthContext";

const Login = () => {
  const auth = useAuthContext();

  return (
    <>
      {!auth.isAuthenticated && (
        <LoginLayOut>
          <LoginLayOut.SideBarComponent>
            <button onClick={() => auth.login()} className="button">
              Login
            </button>
          </LoginLayOut.SideBarComponent>
        </LoginLayOut>
      )}
    </>
  );
};

export default Login;
