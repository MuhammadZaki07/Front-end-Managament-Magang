import dayjs from "dayjs";
import React from "react";

export default function TablePendaftaran({
  data,
  searchTerm,
  selectedDate,
  selectedDivisi,
  selectedStatus,
}) {
  
  // PERBAIKAN: Akses berkas dari item.berkas (langsung dari item, bukan dari item.user)
  const getProfilePhoto = (item) => {
    const berkasArr = item?.berkas;
    const profile = berkasArr?.find((f) => f.type === "profile");
    return profile
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${profile.path}`
      : "/Cover.png";
  };
  
  // Fungsi bantu untuk status warna
  const getStatusColor = (status) => {
    switch (status) {
      case "Peserta Aktif":
        return "text-[#16A34A]";
      case "Alumni":
        return "text-[#0069AB]";
      default:
        return "text-gray-700";
    }
  };

  const getStatusMagang = (mulai, selesai) => {
    // Validasi input terlebih dahulu
    if (!mulai || !selesai) return "Alumni";
    
    const today = dayjs();
    const mulaiDate = dayjs(mulai);
    const selesaiDate = dayjs(selesai);

    // Validasi apakah tanggal valid
    if (!mulaiDate.isValid() || !selesaiDate.isValid()) return "Alumni";

    return today.isBefore(selesaiDate.add(1, "day")) &&
      today.isAfter(mulaiDate.subtract(1, "day"))
      ? "Aktif"
      : "Alumni";
  };

  // Filter data sesuai inputan - PERBAIKAN: Akses data langsung dari item (bukan dari item.user)
  const filteredData = data.filter((item) => {
    // Validasi struktur data - sekarang properties ada langsung di item
    if (!item || !item.nama) {
      console.warn("Item tidak memiliki nama:", item);
      return false;
    }
    
    const isMatchSearch = searchTerm
      ? (item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    const isMatchDate = selectedDate
      ? item.mulai_magang &&
        new Date(item.mulai_magang).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      : true;

    const isMatchDivisi = selectedDivisi
      ? item.divisi === selectedDivisi
      : true;

    const isMatchStatus = selectedStatus
      ? getStatusMagang(item.mulai_magang, item.selesai_magang) ===
        selectedStatus
      : true;

    return isMatchSearch && isMatchDate && isMatchDivisi && isMatchStatus;
  });

  const handlePhotoClick = (itemId) => {
    if (itemId) {
      window.location.href = `/perusahaan/detail-siswa/${itemId}`;
    }
  };

  console.log("Data yang diterima di table:", data);
  console.log("Data setelah filter:", filteredData);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
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
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              // Validasi ulang untuk memastikan item memiliki nama
              if (!item.nama) {
                console.error("Item tidak memiliki nama:", item);
                return null;
              }
              
              const statusMagang = getStatusMagang(item.mulai_magang, item.selesai_magang);
              
              return (
                <tr
                  key={item.id || index}
                  className="border-t border-gray-200 hover:bg-gray-50 text-center"
                >
                  <td className="px-3 py-3">{index + 1}</td>
                  <td className="px-3 py-3 flex items-center gap-2 justify-center">
                    <img
                      src={getProfilePhoto(item)} 
                      alt={item.nama || "User"}
                      className="w-8 h-8 rounded-full cursor-pointer object-cover"
                      onClick={() => handlePhotoClick(item.id)}
                      onError={(e) => {
                        console.log("Error loading image:", e.target.src);
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    {item.nama || "Nama tidak tersedia"}
                  </td>
                  <td className="px-3 py-3">{item.email || "-"}</td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-medium">
                      {statusMagang === "Aktif" ? (
                        <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded text-xs font-semibold">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-blue-800 px-4 py-1.5 rounded text-xs font-semibold">
                          Alumni
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-3">{item.sekolah || "-"}</td>
                  <td className="px-3 py-3">{item.divisi || "-"}</td>
                </tr>
              );
            }).filter(Boolean) // Hapus item null
          ) : (
            <tr>
              <td colSpan="6" className="px-3 py-6 text-center text-gray-500">
                {data.length === 0 
                  ? "Tidak ada data peserta" 
                  : "Tidak ada data yang sesuai dengan filter"
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}