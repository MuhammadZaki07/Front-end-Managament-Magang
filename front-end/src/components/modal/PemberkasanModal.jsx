import { useState } from "react";
import { X, Calendar, Upload } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InternshipModal({ isOpen, onClose, jobData }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const idLowongan = jobData?.id;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const closeModal = () => {
    onClose();
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("id_lowongan", idLowongan);
    formData.append("mulai", startDate);
    formData.append("selesai", endDate);
    formData.append("surat_pernyataan_diri", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/magang`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Berhasil:", res.data);
      navigate("/peserta/dashboard");
      onClose();
    } catch (err) {
      console.error("Gagal:", err);
      
      // Check if this is the specific "complete your data first" error
      if (err.response && err.response.status === 403 && 
          err.response.data && err.response.data.message === "Silahkan lengkapi data diri terlebih dahulu") {
        setErrorMessage("Silahkan lengkapi data diri terlebih dahulu sebelum mengajukan permohonan magang.");
        setShowErrorModal(true);
      } else {
        setError("Gagal menyimpan. Periksa kembali input Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const DatePicker = ({ selectedDate, onChange, minDate }) => {
    const today = new Date();
    const initialDate =
      selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : today;

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const renderCalendarDays = () => {
      const days = [];
      const blanks = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        blanks.push(<div key={`blank-${i}`} className="h-8 w-8"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isSelected =
          selectedDate &&
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear();

        const isDisabled = minDate && date < minDate;

        days.push(
          <div
            key={day}
            onClick={() => {
              if (!isDisabled) onChange(date);
            }}
            className={`h-8 w-8 flex items-center justify-center cursor-pointer rounded-full
              ${isSelected ? "bg-blue-600 text-white" : ""}
              ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            {day}
          </div>
        );
      }

      return [...blanks, ...days];
    };

    return (
      <div className="w-64">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            &lt;
          </button>
          <div className="font-medium">
            {months[currentMonth]} {currentYear}
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              className="h-8 w-8 text-xs font-medium flex items-center justify-center"
            >
              {d}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    );
  };

  // Error Modal Component
  const ErrorModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[10000]">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-red-600">Perhatian</h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-center">{message}</p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                onClose();
                navigate("/peserta/dashboard"); // Navigate to profile page so user can complete their data
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mr-2"
            >
              Lengkapi Data
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Pemberkasan Magang</h2>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mulai Magang
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="yyyy-mm-dd"
                  value={startDate}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
                />
                <Calendar
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  size={18}
                />
                {showStartCalendar && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                    <DatePicker
                      selectedDate={startDate ? new Date(startDate) : new Date()}
                      minDate={new Date()}
                      onChange={(date) => {
                        setStartDate(formatDate(date));
                        setShowStartCalendar(false);
                        setEndDate(""); // reset end date
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Selesai Magang
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="yyyy-mm-dd"
                  value={endDate}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
                />
                <Calendar
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  size={18}
                />
                {showEndCalendar && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                    <DatePicker
                      selectedDate={endDate ? new Date(endDate) : new Date()}
                      minDate={startDate ? new Date(startDate) : new Date()}
                      onChange={(date) => {
                        setEndDate(formatDate(date));
                        setShowEndCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Surat */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Surat Pernyataan Diri
              </label>
              <label className="flex flex-col">
                <div className="w-full border border-gray-300 rounded-md p-2 pl-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-500 truncate">
                    {fileName || "Choose File"}
                  </span>
                  <Upload size={18} className="text-gray-400" />
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-red-500 text-xs mt-1">
                *Format: pdf, doc, jpg, jpeg, png. Max 2MB
              </p>
              <button
                className="mt-2 text-blue-600 text-sm flex items-center hover:text-blue-800"
                onClick={() => {
                  const templateUrl = "../berkas/Surat_Pernyataan_Diri.pdf";
                  const link = document.createElement("a");
                  link.href = templateUrl;
                  link.download = "Surat_Pernyataan_Diri.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Template Surat Pernyataan Diri
              </button>
            </div>

            {/* Form validation errors */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Tombol Simpan */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !startDate || !endDate || !file}
                className={`bg-blue-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-blue-700 transition-colors ${
                  (loading || !startDate || !endDate || !file) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={closeModal}
                className="bg-pink-100 text-pink-600 py-2 px-4 rounded-md flex-1 hover:bg-pink-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal for 403 Forbidden - incomplete profile data */}
      <ErrorModal 
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}