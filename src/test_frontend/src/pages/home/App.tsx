import { useNavigate } from "react-router-dom";
import LoginLayOut from "../../components/LoginLayOut/LoginLayOut";
import { useAuthContext } from "../../context/hooks/useAuthContext";
import { useEffect } from "react";

const Login = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await auth.login();
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/admin/home");
    }
  }, [auth.isAuthenticated]);

  return (
    <LoginLayOut>
      <LoginLayOut.SideBarComponent>
        <button onClick={handleLogin} className="button">
          Login
        </button>
      </LoginLayOut.SideBarComponent>
    </LoginLayOut>
  );
};

export default Login;
6;
