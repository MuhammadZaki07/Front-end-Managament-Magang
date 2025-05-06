import { useState } from "react";
import { Search, Calendar, ArrowDown, MoreVertical } from "lucide-react";

export default function PendataanPiket() {
  // Data untuk tabel piket (dengan URL bukti yang disematkan)
  const allPiketData = [
    {
      id: 1,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 2,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Izin",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 3,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 4,
      nama: "Budi Santoso",
      tanggal: "Selasa, 3 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 5,
      nama: "Citra Dewi",
      tanggal: "Selasa, 3 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 6,
      nama: "Deni Kurniawan",
      tanggal: "Rabu, 4 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 7,
      nama: "Eka Putri",
      tanggal: "Rabu, 4 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 8,
      nama: "Fajar Ramadhan",
      tanggal: "Kamis, 5 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 9,
      nama: "Gita Puspita",
      tanggal: "Kamis, 5 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Izin",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 10,
      nama: "Hadi Santoso",
      tanggal: "Jumat, 6 Desember 2024",
      hari: "Jumat",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 11,
      nama: "Indah Permata",
      tanggal: "Jumat, 6 Desember 2024",
      hari: "Jumat",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 12,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 9 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 13,
      nama: "Budi Santoso",
      tanggal: "Selasa, 10 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 14,
      nama: "Deni Kurniawan",
      tanggal: "Rabu, 11 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    },
    {
      id: 15,
      nama: "Eka Putri",
      tanggal: "Kamis, 12 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiUrl: "/api/placeholder/150/100" // Placeholder image
    }
  ];
  
  // Filter hari aktif
  const [activeDay, setActiveDay] = useState("Senin");
  
  // Filter data berdasarkan hari yang dipilih
  const filteredData = allPiketData.filter(item => item.hari === activeDay);

  // Status badge dengan warna yang sesuai
  const getStatusBadge = (status) => {
    switch (status) {
      case "Hadir":
        return (
          <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs">
            Hadir
          </span>
        );
      case "Izin":
        return (
          <span className="bg-orange-100 text-orange-600 py-1 px-3 rounded-full text-xs">
            Izin
          </span>
        );
      case "Tidak Piket":
        return (
          <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs">
            Tidak Piket
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm max-w-7xl mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Pendataan Piket</h1>
              <p className="text-sm text-gray-500">Kelola pendataan dengan lebih fleksibel</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#0069AB] text-white px-3 py-2 rounded-lg text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>25 Maret 2025</span>
              </button>
            </div>
          </div>

          {/* Menu bar hari tanpa counter */}
          <div className="flex gap-2 mb-6">
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <button
                key={day}
                className={`px-6 py-2 rounded-lg text-sm font-medium ${
                  activeDay === day
                    ? "bg-[#0069AB] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left text-[#667797] text-semibold border-b">
                  <th className="py-3 px-4 font-medium w-12"></th>
                  <th className="py-3 px-4 font-medium">Nama Petugas</th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Hari/Tanggal <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Kegiatan <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Waktu Plan <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Waktu Input <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Status Piket <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">Bukti</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-[#667797]">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#667797]">{item.nama}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.tanggal}</td>
                    <td className="py-3 px-4 text-sm text-[#667797]">
                      {item.kegiatan.split(", ").map((task, idx) => (
                        <div key={idx}>{task}</div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.waktuPlan}</td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.waktuInput}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <img 
                          src={item.buktiUrl}
                          alt={`Bukti piket ${item.nama}`}
                          className="h-10 w-16 rounded object-cover"
                        />
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}