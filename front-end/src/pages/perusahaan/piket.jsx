import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, FileText, User, CheckCircle, ChevronDown } from "lucide-react";
import Select from 'react-select';

export default function JadwalPiket() {
  const navigate = useNavigate();
  const [shift, setShift] = useState("Pagi");
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Mendapatkan semua nama peserta unik dari data jadwal
  const getAllUniqueMembers = () => {
    const allMembers = new Set();
    
    // Ambil dari shift pagi
    scheduleData.Pagi.forEach(day => {
      day.members.forEach(member => {
        allMembers.add(member);
      });
    });
    
    // Ambil dari shift sore
    scheduleData.Sore.forEach(day => {
      day.members.forEach(member => {
        allMembers.add(member);
      });
    });
    
    // Konversi ke format yang dibutuhkan oleh react-select
    return Array.from(allMembers).map(member => ({
      value: member,
      label: member
    }));
  };

  const scheduleData = {
    Pagi: [
      { name: "Senin", members: ["Alexander Jonathan Pratama", "Isabelle Mariana Dewantara", "Christopher Emmanuel Santoso"] },
      { name: "Selasa", members: ["Dominique Nathania Siregar", "Fredericka Angeline Putri", "Isabelle Mariana Dewantara"] },
      { name: "Rabu", members: ["Christopher Emmanuel Santoso", "Dominique Nathania Siregar", "Fredericka Angeline Putri"] },
      { name: "Kamis", members: ["Alexander Jonathan Pratama", "Isabelle Mariana Dewantara", "Fredericka Angeline Putri"] },
      { name: "Jum'at", members: ["Christopher Emmanuel Santoso", "Dominique Nathania Siregar", "Alexander Jonathan Pratama"] },
    ],
    Sore: [
      { name: "Senin", members: ["Budi Santoso", "Sari Dewi", "Andi Pratama"] },
      { name: "Selasa", members: ["Dewi Lestari", "Rudi Hartono", "Andi Pratama"] },
      { name: "Rabu", members: ["Budi Santoso", "Sari Dewi", "Rudi Hartono"] },
      { name: "Kamis", members: ["Dewi Lestari", "Sari Dewi", "Andi Pratama"] },
      { name: "Jum'at", members: ["Budi Santoso", "Rudi Hartono", "Dewi Lestari"] },
    ],
  };

  const days = scheduleData[shift];

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
    return (
      <div className={`rounded-lg border ${colors.border} shadow-md ${colors.bg} p-6 w-full transition-all duration-300 hover:shadow-lg`}>
        <div className="flex items-center mb-4">
          <div className={`${colors.icon} rounded-lg p-2 mr-3`}>
            <div className={`${colors.accent} text-white rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <h2 className={`text-xl font-bold ${colors.text}`}>{day.name}</h2>
          <div className="ml-auto">
            <button className="border border-gray-300 px-4 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300">Laporkan</button>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {day.members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">
                {index + 1}. {member}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Jadwal Piket</h1>
        <p className="text-gray-500">Daftar petugas piket {shift.toLowerCase()} mingguan</p>
      </div>

      {/* Tombol Shift dan Detail */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div className="flex space-x-3">
          <button
            onClick={() => setShift("Pagi")}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${shift === "Pagi" ? "text-white shadow-md" : "border border-gray-500 text-gray-500 bg-white hover:bg-blue-50"}`}
            style={shift === "Pagi" ? { backgroundColor: "#0069AB" } : {}}
          >
            <Sun className="w-4 h-4 mr-2" />
            Shift Pagi
          </button>

          <button
            onClick={() => setShift("Sore")}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${shift === "Sore" ? "text-white shadow-md" : "border border-gray-500 text-gray-500 bg-white hover:bg-blue-50"}`}
            style={shift === "Sore" ? { backgroundColor: "#0069AB" } : {}}
          >
            <Moon className="w-4 h-4 mr-2" />
            Shift Sore
          </button>
          
          <button
            onClick={() => navigate("/perusahaan/laporan")}
            className="flex items-center px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-400 text-slate-600 bg-white hover:bg-[#0069AB] hover:text-white transition-colors duration-300 shadow-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Detail Laporan
          </button>
        </div>

        {/* Tombol Tambah Data */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-400 text-slate-600 bg-white hover:bg-[#0069AB] hover:text-white transition-colors duration-300 shadow-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Tambah Data
        </button>
      </div>

      {/* Grid Jadwal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {days.map((day, idx) =>
          idx === 4 ? (
            <div key={day.name} className="md:col-span-2 md:w-1/2 md:mx-auto">
              <DayCard day={day} />
            </div>
          ) : (
            <DayCard key={day.name} day={day} />
          )
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>Total Anggota: {days.reduce((total, day) => total + day.members.length, 0)}</span>
        </div>
        <span>Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Tambah Data Piket</h2>
            
            {/* Form Tambah */}
            <form onSubmit={(e) => {
              e.preventDefault();
              // Implementasi logika penyimpanan data
              console.log("Hari:", selectedDay);
              console.log("Anggota:", selectedMembers);
              console.log("Shift:", shift); // Menggunakan shift yang sudah dipilih di menu utama
              setShowModal(false);
              // Reset form
              setSelectedDay(null);
              setSelectedMembers([]);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                <div className="relative">
                  <select 
                    value={selectedDay || ""} 
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>Pilih Hari</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Anggota</label>
                <Select
                  isMulti
                  name="members"
                  options={getAllUniqueMembers()}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Pilih anggota piket..."
                  value={selectedMembers}
                  onChange={setSelectedMembers}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Pilih minimal 1 anggota untuk jadwal piket</p>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Shift</label>
                <div className="mt-1 flex items-center">
                  <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium">
                    {shift === "Pagi" ? (
                      <span className="flex items-center">
                        <bi bi-sunrise className="w-4 h-4 mr-2 text-blue-500" />
                        Shift Pagi
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Moon className="w-4 h-4 mr-2 text-yellow-500" />
                        Shift Sore
                      </span>
                    )}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">Sesuai dengan shift yang dipilih</span>
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