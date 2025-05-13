import React from "react";

export default function TablePendaftaran({
  data,
  searchTerm,
  selectedDate,
  selectedDivisi,
  selectedStatus,
}) {
  // Fungsi bantu untuk ambil path foto profile
  const getProfilePhoto = (fotoArr) => {
    const profile = fotoArr?.find((f) => f.type === "profile");
    return profile ? `${import.meta.env.VITE_API_URL_FILE}/storage/${profile.path}` : "/default-avatar.png";
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

  // Filter data sesuai inputan
  const filteredData = data.filter((item) => {
    const isMatchSearch = searchTerm
      ? item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const isMatchDate = selectedDate
      ? item.mulai_magang &&
        new Date(item.mulai_magang).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      : true;

    const isMatchDivisi = selectedDivisi
      ? item.divisi?.nama === selectedDivisi
      : true;

    const isMatchStatus = selectedStatus
      ? item.status_magang === selectedStatus
      : true;

    return isMatchSearch && isMatchDate && isMatchDivisi && isMatchStatus;
  });

  const handlePhotoClick = (id) => {
    window.location.href = `/perusahaan/detail-siswa/${id}`;
  };

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
            filteredData.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 hover:bg-gray-50 text-center"
              >
                <td className="px-3 py-3">{index + 1}</td>
                <td className="px-3 py-3 flex items-center gap-2 justify-center">
                  <img
                    src={getProfilePhoto(item.foto)}
                    alt={item.nama}
                    className="w-8 h-8 rounded-full cursor-pointer object-cover"
                    onClick={() => handlePhotoClick(item.id)}
                  />
                  {item.nama}
                </td>
                <td className="px-3 py-3">{item.email}</td>
                <td
                  className={`px-3 py-3 font-medium ${getStatusColor(
                    item.status_magang
                  )}`}
                >
                  {item.status_magang || "-"}
                </td>
                <td className="px-3 py-3">{item.sekolah || "-"}</td>
                <td className="px-3 py-3">{item.divisi?.nama || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-3 py-6 text-center text-gray-500">
                Tidak ada data yang ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
