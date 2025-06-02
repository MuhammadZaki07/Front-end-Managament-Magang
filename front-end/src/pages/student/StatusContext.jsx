// StatusContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [internshipStatus, setInternshipStatus] = useState("menunggu");
  const [userLoading, setUserLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/complete/peserta`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data;
      setProfileComplete(data.is_profil_lengkap);
      setInternshipStatus(data.is_magang);
      sessionStorage.setItem("profileComplete", JSON.stringify(data.is_profil_lengkap));
      sessionStorage.setItem("internshipStatus", JSON.stringify(data.is_magang));
      setRole("peserta");
    } catch (error) {
      console.error("Gagal fetch data user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    const savedProfileComplete = sessionStorage.getItem("profileComplete");
    const savedInternshipStatus = sessionStorage.getItem("internshipStatus");

    if (savedProfileComplete && savedInternshipStatus) {
        setProfileComplete(JSON.parse(savedProfileComplete));
        setInternshipStatus(JSON.parse(savedInternshipStatus));
        setUserLoading(false);
    } else {
        fetchUserData(); 
    }
}, [token]);


  return (
    <StatusContext.Provider
      value={{
        token,
        setToken,
        role,
        setRole,
        profileComplete,
        internshipStatus,
        userLoading,
        refreshUserData: fetchUserData,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
