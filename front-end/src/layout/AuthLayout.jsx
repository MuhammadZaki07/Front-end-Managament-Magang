import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthLayout = () => {
  const { token, user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user && role) {

      const redirectTo = localStorage.getItem("location");

      if (redirectTo) {
        console.log(redirectTo);
        
        navigate(redirectTo);
        localStorage.removeItem("location");
      } else {
        console.log('kenapa nih');
        
        navigate("/");
      }
    }
  }, [token, user, navigate, role]);

  return <Outlet />;
};

export default AuthLayout;
