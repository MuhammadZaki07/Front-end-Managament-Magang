import React from "react";

export default function TablePendaftaran({ 
  data, 
  searchTerm, 
  selectedDate, 
  selectedDivisi, 
  selectedStatus 
}) {
  // Filter data based on all filter criteria
  const filteredData = data.filter((item) => {
    const isMatchSearch = searchTerm 
      ? item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const isMatchDate = selectedDate
      ? new Date(item.statusMagang).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;
    
    const isMatchDivisi = selectedDivisi
      ? item.divisi === selectedDivisi
      : true;
    
    const isMatchStatus = selectedStatus
      ? item.statusMagang === selectedStatus
      : true;
    
    return isMatchSearch && isMatchDate && isMatchDivisi && isMatchStatus;
  });

  // Function to determine status text color
  const getStatusColor = (status) => {
    switch(status) {
      case "Peserta Aktif":
        return "text-[#16A34A]"; // Green color
      case "Alumni":
        return "text-[#0069AB]"; // Blue color
      default:
        return "text-gray-700"; // Default color
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <colgroup>
          <col className="w-12" /> {/* No column - narrow width */}
          <col className="w-1/5" /> {/* Nama Lengkap */}
          <col className="w-1/5" /> {/* Email */}
          <col className="w-1/5" /> {/* Status Magang */}
          <col className="w-1/5" /> {/* Sekolah */}
          <col className="w-1/5" /> {/* Divisi */}
        </colgroup>
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-center font-medium">Nama Lengkap</th>
            <th className="px-3 py-3 text-center font-medium">Email</th>
            <th className="px-3 py-3 text-center font-medium">Status Magang</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Divisi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-gray-200 hover:bg-gray-50 text-center"
            >
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3 flex items-center gap-2 justify-center">
                <img
                  src={item.image}
                  alt={item.namaLengkap}
                  className="w-8 h-8 rounded-full"
                />
                {item.namaLengkap}
              </td>
              <td className="px-3 py-3">{item.email}</td>
              <td className={`px-3 py-3 font-medium ${getStatusColor(item.statusMagang)}`}>
                {item.statusMagang}
              </td>
              <td className="px-3 py-3">{item.sekolah}</td>
              <td className="px-3 py-3">{item.divisi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}