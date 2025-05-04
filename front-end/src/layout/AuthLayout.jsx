import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthLayout = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const redirectTo = localStorage.getItem("location");

      if (redirectTo) {
        navigate(redirectTo);
        localStorage.removeItem("location");
      } else {
        navigate("/");
      }
    }
  }, [token, user, navigate]);

  return <Outlet />;
};

export default AuthLayout;
