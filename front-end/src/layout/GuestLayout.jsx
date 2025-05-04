import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const GuestLayout = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = localStorage.getItem("location");

  useEffect(() => {
    if (user && token) {
      navigate(location);
    }
  }, [token, user, navigate, location]); 

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default GuestLayout;
