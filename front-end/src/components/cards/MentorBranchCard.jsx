import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import ReactPaginate from "react-paginate";
import ModalTambahMentor from "../../components/modal/ModalTambahMentor";
import ModalDelete from "../../components/modal/ModalDeleteAdminCabang";
import ModalDetailMentor from "../../components/modal/ModalDetailMentor";
import Loading from "../../components/cards/Loading";

export default function MentorBranchCard() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [modalState, setModalState] = useState({
    showDeleteModal: false,
    selectedBranchId: null,
  });
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const [selectedDivision, setSelectedDivision] = useState("All");
  const filteredBranches = Array.isArray(branches)
    ? selectedDivision === "All"
      ? branches
      : branches.filter(
          (branch) => String(branch.divisi.id) === String(selectedDivision)
        )
    : [];

  const pageCount = Math.ceil(filteredBranches.length / itemsPerPage);
  const displayedBranches = filteredBranches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const fetchMentors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentor`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBranches(Array.isArray(response.data?.data) ? response.data.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/divisi`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDivisions(
        Array.isArray(response.data?.data) ? response.data.data : []
      );
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  useEffect(() => {
    fetchDivisions();
    fetchMentors();
  }, []);

  const handleEditMentor = (mentor) => {
    setEditingMentor(mentor);
    setIsModalOpen(true);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleViewDetail = (mentor) => {
    setSelectedMentor(mentor);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (branchId) => {
    setModalState({
      showDeleteModal: true,
      selectedBranchId: branchId,
    });
  };

  const handleCloseDeleteModal = () => {
    setModalState({
      showDeleteModal: false,
      selectedBranchId: null,
    });
  };

  const handleDeleteBranch = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/mentor/${modalState.selectedBranchId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBranches(
        branches.filter((branch) => branch.id !== modalState.selectedBranchId)
      );
      fetchMentors();
      handleCloseDeleteModal();
      fetchMentors();
    } catch (error) {
      console.error("Error deleting mentor:", error);
    }finally{
      setLoading(false)
    }
  };

  if (loading) return <Loading />;

  return (
    <Card>
      <div className="mt-3 px-2 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Mentor Terdaftar</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Mentor</span>
            </button>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-xs"
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="All">Semua Divisi</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedBranches.map((branch) => {
            const cover = branch.foto.find((f) => f.type === "cover");
            const profile = branch.foto.find((f) => f.type === "profile");
            const user = branch.user || {};

            return (
              <div
                key={branch.id}
                className="bg-white border border-[#D5DBE7] rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                      cover?.path
                    }`}
                    alt="Background"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                    <div className="rounded-full overflow-hidden border-2 border-white bg-white w-16 h-16">
                      <img
                        src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                          profile?.path
                        }`}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-8 px-3 pb-4">
                  <h3 className="font-bold text-sm text-gray-800 text-center mb-1">
                    {user.nama || "Nama Tidak Ditemukan"}{" "}
                  </h3>
                  <p className="text-xs text-black-500 text-center mb-3 italic">
                    {branch.divisi?.nama || "Divisi Tidak Diketahui"}{" "}
                  </p>
                  <p className="text-xs text-black-600 text-center mb-1">
                    {user.email || "Email Tidak Diketahui"}{" "}
                  </p>
                  <p className="text-xs text-black-600 text-center mb-1">
                    {user.telepon || "Telepon Tidak Diketahui"}{" "}
                  </p>
                  <div className="flex justify-center mt-2">
                    <div className="border border-[#D5DBE7] rounded p-2 w-full flex justify-between items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(profile?.path)}
                        className="text-blue-500 border border-blue-500 rounded px-3 py-1 text-xs hover:bg-blue-50"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleEditMentor(branch)}
                        className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(branch.id)}
                        className="text-red-500 border border-red-500 rounded px-3 py-1 text-xs hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayedBranches.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1">
              <ReactPaginate
                previousLabel="← Sebelumnya"
                nextLabel="Berikutnya →"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName="flex justify-center items-center space-x-2"
                pageLinkClassName="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-blue-100"
                activeLinkClassName="bg-blue-500 text-white"
                previousClassName="mr-auto"
                nextClassName="ml-auto"
                previousLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
                nextLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
              />
            </div>
          </div>
        )}

        <ModalTambahMentor
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMentor(null);
          }}
          onSuccess={() => {
            fetchMentors();
          }}
          mode={editingMentor ? "edit" : "add"}
          mentorData={editingMentor}
        />

        <ModalDelete
          isOpen={modalState.showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteBranch}
        />

        <ModalDetailMentor
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          mentor={selectedMentor}
        />
      </div>
    </Card>
  );
}
