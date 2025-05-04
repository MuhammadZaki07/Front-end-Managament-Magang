import { useEffect, useState } from "react";

const AlertVerification = () => {
  const [isPerusahaan, setIsPerusahaan] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("perusahaan")) {
      setIsPerusahaan(true);
    } else if (currentPath.includes("student")) {
      setIsPerusahaan(false);
    }
  }, []);

  const handleVerificationClick = () => {
    if (isPerusahaan) {
      window.location.href = "http://localhost:5173/perusahaan/settings";
    } else {
      window.location.href = "http://localhost:5173/student/settings";
    }
  };

  return (
    <div className="w-full h-14 bg-red-50 border border-red-500 rounded-lg flex justify-between py-1 px-3 items-center mb-4">
      <h1 className="text-red-600 font-semibold text-sm">
        Anda Belum Mengisi Data Diri
      </h1>
      <button
        onClick={handleVerificationClick}
        className="font-semibold text-red-500 text-sm bg-white border border-red-500 rounded-lg py-2 px-4"
      >
        Verifikasi Data Anda
      </button>
    </div>
  );
};

export default AlertVerification;
