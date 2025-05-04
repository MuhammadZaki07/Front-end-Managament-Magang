import React, { useEffect, useState } from "react";
import Card from "./Card";
import TempatkanModal from "../modal/TempatkanModal";
import Penempatan from "./Penempatan";
import Detaildivisi from "../modal/WebDevModal";
import axios from "axios";
import ModalDivisi from "../modal/ModalDivisi";
import LoadingCards from "../cards/LoadingCards";

export default function DivisiBranchCard() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 12;
  const [isTempatkanModalOpen, setIsTempatkanModalOpen] = useState(false);
  const [isDetaildivisiOpen, setIsDetaildivisiOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const pageCount = Math.ceil(branches.length / itemsPerPage);
  const displayedBranches = branches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const [loading, setLoading] = useState(true);

  const getDataAllDevsion = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/divisi`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBranches(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataAllDevsion();
  }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus divisi ini?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      if (isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/divisi/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
    } catch (error) {
      console.error(
        "Gagal menghapus divisi:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlePlace = (item) => {
    setSelectedItem(item);
    setIsTempatkanModalOpen(true);
  };

  const handleDetailDevision = (branch) => {
    setSelectedItem(branch);
    setIsDetaildivisiOpen(true);
  };

  if (loading) return <LoadingCards />;

  
  return (
    <Card>
      <div className="mt-8 px-1 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Divisi Terdaftar</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Divisi</span>
            </button>
            <div className="flex items-center">
              <span className="mr-1 text-xs">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
            </div>
          </div>
        </div>

        {branches.length === 0 ? (
          <div className="py-10">
            <p className="text-center">Data Tidak Tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedBranches.map((branch) => {
              const foto_cover = branch.foto?.find(
                (f) => f.type === "foto_cover"
              );
              return (
                <div
                  key={branch.id}
                  className="bg-white border border-[#CED2D9] rounded-lg overflow-hidden pt-2 px-2 pb-2 mb-4"
                >
                  <div className="rounded-md overflow-hidden mb-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                        foto_cover?.path
                      }`}
                      alt="Background"
                      className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleDetailDevision(branch)}
                    />
                  </div>
                  <h3 className="font-bold text-sm text-gray-800">
                    {branch.nama}
                  </h3>

                  {branch.kategori && branch.kategori.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {branch.kategori.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 text-xs rounded-md px-2 py-0.5"
                        >
                          {category.nama}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[#D5DBE7] mt-2 pt-2">
                    <p className="text-xs text-black-500 flex justify-between">
                      <span className="flex items-center">
                        <i className="bi bi-calendar-event mr-1 text-blue-500"></i>{" "}
                        {branch.created_at}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center mt-3">
                    <div className="border border-[#D5DBE7] rounded p-2 w-full flex justify-between items-center space-x-2">
                      <button
                        onClick={() => handlePlace(branch)}
                        className="text-[#0069AB] border border-[#0069AB] rounded px-3 py-1 text-xs hover:bg-orange-50"
                      >
                        Tempatkan
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setSelectedDivision(branch);
                        }}
                        className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(branch.id)}
                        className="text-red-500 border border-red-500 rounded px-3 py-1 text-xs hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pageCount > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Penempatan />

      <ModalDivisi
        showModal={showModal}
        setShowModal={setShowModal}
        editingDivision={selectedDivision}
        onSuccess={() => {
          getDataAllDevsion();
        }}
      />

      <TempatkanModal
        isOpen={isTempatkanModalOpen}
        onClose={() => setIsTempatkanModalOpen(false)}
        data={selectedItem}
      />

      <Detaildivisi
        isOpen={isDetaildivisiOpen}
        onClose={() => setIsDetaildivisiOpen(false)}
        data={selectedItem}
      />
    </Card>
  );
}
