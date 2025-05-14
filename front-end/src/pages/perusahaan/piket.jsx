import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sun,
  Moon,
  FileText,
  User,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Select from "react-select";

export default function JadwalPiket() {
  const navigate = useNavigate();
  const [shift, setShift] = useState("Pagi");
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [allMembersOptions, setAllMembersOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({
    Pagi: [],
    Sore: [],
  });

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/peserta-by-cabang`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const options = res.data.data.map((item) => ({
        value: item.id,
        label: item.nama,
      }));
      setAllMembersOptions(options);
    } catch (err) {
      console.error("Gagal mengambil data peserta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/piket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Log response data yang diterima
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
          members: schedule.peserta.map((p) => p.nama), // Nama peserta
        })),
        Sore: sore.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Nama peserta
        })),
      };

      setScheduleData(formattedSchedule);
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleEditClick = (day) => {
    setEditMode(true);
    setEditingScheduleId(day.id);
    setSelectedDay(day.hari);
    setShift(capitalize(day.shift));
    const matchedMembers = allMembersOptions.filter((opt) =>
      day.members.includes(opt.label)
    );
    setSelectedMembers(matchedMembers);
    setShowModal(true);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = {
      hari: selectedDay?.toLowerCase(),
      shift: shift.toLowerCase(),
      peserta: selectedMembers.map((m) => m.value),
    };

    try {
      if (editMode && editingScheduleId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/piket/${editingScheduleId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/piket`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await fetchSchedule();
      setShowModal(false);
      setSelectedDay(null);
      setSelectedMembers([]);
      setEditMode(false);
      setEditingScheduleId(null);
    } catch (err) {
      console.error("Gagal simpan jadwal:", err.response?.data || err.message);
    }
  };

  const days = scheduleData[shift] || [];

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

  const DayCard = ({ day, onClick }) => {
    const colors = getShiftColors();

    const members = Array.isArray(day.members) ? day.members : [];

    return (
      <div
        onClick={onClick}
        className={`rounded-lg border ${colors.border} shadow-md ${colors.bg} p-6 w-full hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer`}
      >
        <div className="flex items-center mb-4">
          <div className={`${colors.icon} rounded-lg p-2 mr-3`}>
            <div
              className={`${colors.accent} text-white rounded-full p-2 w-8 h-8 flex items-center justify-center`}
            >
              <CheckCircle className="w-5 h-5" />
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
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Jadwal Piket</h1>
        <p className="text-gray-500">
          Daftar petugas piket {shift.toLowerCase()} mingguan
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

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-400 text-slate-600 bg-white hover:bg-[#0069AB] hover:text-white transition-colors duration-300 shadow-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Tambah Data
        </button>
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
              <DayCard day={day} onClick={() => handleEditClick(day)} />
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tambah Data Piket</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hari
                </label>
                <div className="relative">
                  <select
                    value={selectedDay || ""}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Pilih Hari
                    </option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jum'at">Jum'at</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anggota
                </label>
                <Select
                  isMulti
                  name="members"
                  options={allMembersOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Pilih anggota piket..."
                  value={selectedMembers}
                  onChange={setSelectedMembers}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Shift
                </label>
                <div className="mt-1 flex items-center">
                  <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium">
                    {shift === "Pagi" ? "Shift Pagi" : "Shift Sore"}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    Sesuai shift terpilih
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDay(null);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
