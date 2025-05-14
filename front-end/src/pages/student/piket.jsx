import { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon, User } from "lucide-react";

export default function JadwalPiketPeserta() {
  const [shift, setShift] = useState("Pagi");
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({
    Pagi: [],
    Sore: [],
  });

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/piket-peserta`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Pisahkan berdasarkan shift
      const pagi = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "pagi"
      );
      const sore = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "sore"
      );

      // Format data agar lebih mudah digunakan
      const formattedSchedule = {
        Pagi: pagi.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama),
        })),
        Sore: sore.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama),
        })),
      };

      setScheduleData(formattedSchedule);
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const getShiftColors = () => {
    return shift === "Pagi"
      ? {
          bg: "bg-white",
          text: "text-black",
          border: "border-gray-200",
          icon: "bg-blue-100",
          accent: "bg-blue-700",
        }
      : {
          bg: "bg-white",
          text: "text-black",
          border: "border-gray-200",
          icon: "bg-yellow-100",
          accent: "bg-yellow-500",
        };
  };

  const DayCard = ({ day }) => {
    const colors = getShiftColors();
    const members = Array.isArray(day.members) ? day.members : [];

    return (
      <div className={`rounded-lg border ${colors.border} shadow-md ${colors.bg} p-6 w-full transition-all duration-200 ease-in-out`}>
        <div className="flex items-center mb-4">
          <div className={`${colors.icon} rounded-lg p-2 mr-3`}>
            <div className={`${colors.accent} text-white rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
              {day.hari.charAt(0)}
            </div>
          </div>
          <h2 className={`text-xl font-bold ${colors.text}`}>{day.hari}</h2>
        </div>
        <div className="mt-5 space-y-3">
          {members.length > 0 ? (
            members.map((name, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">
                  {index + 1}. {name}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">
              Tidak ada peserta untuk hari ini.
            </div>
          )}
        </div>
      </div>
    );
  };

  const days = scheduleData[shift] || [];

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Jadwal Piket</h1>
        <p className="text-gray-500">
          Daftar petugas piket {shift.toLowerCase()} mingguan cabang Anda
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div className="flex space-x-3">
          <button
            onClick={() => setShift("Pagi")}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              shift === "Pagi"
                ? "text-white shadow-md"
                : "border border-gray-500 text-gray-500 bg-white hover:bg-blue-50"
            }`}
            style={shift === "Pagi" ? { backgroundColor: "#0069AB" } : {}}
          >
            <Sun className="w-4 h-4 mr-2" />
            Shift Pagi
          </button>

          <button
            onClick={() => setShift("Sore")}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              shift === "Sore"
                ? "text-white shadow-md"
                : "border border-gray-500 text-gray-500 bg-white hover:bg-blue-50"
            }`}
            style={shift === "Sore" ? { backgroundColor: "#0069AB" } : {}}
          >
            <Moon className="w-4 h-4 mr-2" />
            Shift Sore
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div
                key={idx}
                className="w-full h-32 bg-gray-300 animate-pulse rounded-xl"
              />
            ))}
          </>
        ) : (
          days.map((day, idx) => (
            <div
              key={day.hari}
              className={idx === 4 ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""}
            >
              <DayCard day={day} />
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>
            Total Anggota:{" "}
            {days.reduce((total, day) => total + day.members.length, 0)}
          </span>
        </div>
        <span>
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
        </span>
      </div>
    </div>
  );
}