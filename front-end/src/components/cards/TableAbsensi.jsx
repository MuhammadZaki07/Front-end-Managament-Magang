import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

const TableAbsensi = () => {
  const [data, setData] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchAbsensi = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/absensi?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;     
      setData(result.data);
      setLastPage(result.meta?.last_page || 1);
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, [page]);

  const handleSort = () => {
    setSortAsc(!sortAsc);
    setData((prevData) =>
      [...prevData].sort((a, b) =>
        sortAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      )
    );
  };

  return (
    <>
      <Card className="mt-5">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-white text-black font-bold text-sm border-b border-slate-300">
              <tr>
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
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="py-3 px-6 text-center">{item.tanggal}</td>
                  <td className="py-3 px-6 text-center">{item.masuk || "-"}</td>
                  <td className="py-3 px-6 text-center">{item.istirahat || "-"}</td>
                  <td className="py-3 px-6 text-center">{item.kembali || "-"}</td>
                  <td className="py-3 px-6 text-center">{item.pulang || "-"}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        item.status === "telat"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="flex justify-between items-center px-6 py-4">
        <button
          className="px-4 py-2 font-semibold border rounded-full text-sm text-gray-600 hover:bg-blue-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ← Previous
        </button>
        <div className="flex items-center space-x-2 text-sm">
          {Array.from({ length: lastPage }, (_, i) => (
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
          onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={page === lastPage}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default TableAbsensi;
