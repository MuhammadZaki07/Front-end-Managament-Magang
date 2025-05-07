import React from "react";
import { Eye, Printer } from "lucide-react";

export default function DataPenerimaan({ data, searchTerm, selectedDate, selectedJurusan }) {
  // Filter data berdasarkan kriteria pencarian
  const filteredData = data.filter((item) => {
    // Filter berdasarkan searchTerm (dalam nama, sekolah, atau jurusan)
    const matchesSearch = 
      searchTerm === "" || 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jurusan.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter berdasarkan jurusan yang dipilih
    const matchesJurusan = 
      selectedJurusan === "" || 
      item.jurusan === selectedJurusan;
    
    // Filter berdasarkan tanggal yang dipilih
    const matchesDate = 
      !selectedDate || 
      (new Date(item.tanggalDiterima).toDateString() === selectedDate.toDateString());
    
    return matchesSearch && matchesJurusan && matchesDate;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sekolah</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Diterima</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={item.image} alt={item.nama} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.sekolah}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.jurusan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(item.tanggalDaftar).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(item.tanggalDiterima).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-[#0069AB] hover:text-blue-800 flex items-center gap-1">
                      <Eye size={20} />

                    </button>
                    <button className="text-[#0069AB] hover:text-blue-800 flex items-center gap-1">
                      <Printer size={20} />

                    </button>
                    
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                <div className="text-gray-500">Tidak ada data yang ditemukan</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}