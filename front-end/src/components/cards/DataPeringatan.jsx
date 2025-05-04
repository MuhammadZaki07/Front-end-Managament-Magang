import React from "react";

export default function DataPeringatan({ data, searchTerm, selectedDate }) {
  const filteredData = data.filter((item) => {
    const isMatchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keteranganSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statusSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.tanggal).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  const handleView = (item) => {
    console.log("Lihat detail:", item);
    // Navigasi ke halaman detail kalau kamu pakai react-router-dom:
    // navigate(`/detail/${item.id}`);
  };

  const handlePrint = (item) => {
    console.log("Cetak surat untuk:", item);
    // Atau jalankan fungsi cetak di sini
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-center font-medium">Nama</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Keterangan SP</th>
            <th className="px-3 py-3 text-center font-medium">Status SP</th>
            <th className="px-3 py-3 text-center font-medium">Tanggal</th>
            <th className="px-3 py-3 text-center font-medium">Aksi</th>
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
                  alt={item.nama}
                  className="w-8 h-8 rounded-full"
                />
                {item.nama}
              </td>
              <td className="px-3 py-3">{item.sekolah}</td>
              <td className="px-3 py-3">{item.keteranganSP}</td>
              <td className="px-3 py-3">{item.statusSP}</td>
              <td className="px-3 py-3">{item.tanggal}</td>
              <td className="px-3 py-3 flex justify-center gap-3">
                <button onClick={() => handleView(item)} title="Lihat">
                  <i className="bi bi-eye" style={{ color: 'orange', fontSize: '1.5rem' }}></i>
                </button>
                <button onClick={() => handlePrint(item)} title="Print">
                  <i className="bi bi-printer" style={{ color: '#007bff', fontSize: '1.5rem' }}></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
