import { useState } from "react";
import Card from "./Card";

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  name: i % 2 === 0 ? "William James Moriarty" : "Gojo Satoru",
  avatar:
    i % 2 === 0
      ? "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=william"
      : "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=gojo",
  tanggal: "Senin, 29 May 2022",
  masuk: "07.50",
  istirahat: "12.00",
  kembali: "13.00",
  pulang: "17.00",
  // Selang-seling keterangan
  keterangan: i % 2 === 0 ? "Masuk" : "Telat",
}));

const TableAbsensi = () => {
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const handleSort = () => setSortAsc(!sortAsc);

  const sortedData = [...dummyData].sort((a, b) => {
    if (sortAsc) return a.keterangan.localeCompare(b.keterangan);
    return b.keterangan.localeCompare(a.keterangan);
  });

  return (
    <>
      <Card className="mt-5">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-white text-black font-bold text-sm border-b border-slate-300">
            <tr>
              <th className="py-3 px-6">Nama</th>
              <th className="py-3 px-6">Tanggal</th>
              <th className="py-3 px-6">Masuk</th>
              <th className="py-3 px-6">Istirahat</th>
              <th className="py-3 px-6">Kembali</th>
              <th className="py-3 px-6">Pulang</th>
              <th
                className="py-3 px-6 text-center cursor-pointer"
                onClick={handleSort}
              >
                <div className="flex items-center gap-2">
                  <span className="mr-1">Keterangan</span>
                  <div className="flex flex-col -space-y-1 leading-none">
                    <i
                      className={`bi bi-caret-up-fill text-xs ${
                        sortAsc ? "text-black" : "text-gray-400"
                      }`}
                    />
                    <i
                      className={`bi bi-caret-down-fill text-xs ${
                        !sortAsc ? "text-black" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {sortedData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-all duration-150"
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-9 h-9 rounded-full border border-gray-300"
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">{item.tanggal}</td>
                <td className="py-3 px-6 text-center">{item.masuk}</td>
                <td className="py-3 px-6 text-center">{item.istirahat}</td>
                <td className="py-3 px-6 text-center">{item.kembali}</td>
                <td className="py-3 px-6 text-center">{item.pulang}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      item.keterangan === "Telat"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.keterangan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-between items-center px-6 py-4">
        <button
          className="px-4 py-2 font-semibold border rounded-full text-sm text-gray-600 hover:bg-blue-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          ← Previous
        </button>
        <div className="flex items-center space-x-2 text-sm">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 font-semibold rounded-lg border border-slate-400/[0.5] ${
                page === i + 1
                  ? "text-sky-500"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 border rounded-full text-sm text-blue-600 font-semibold hover:bg-blue-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, 10))}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default TableAbsensi;
