import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import ReactPaginate from "react-paginate";
import ModalTambahAdminCabang from "../../components/modal/ModalTambahAdminCabang";
import ModalDeleteAdminCabang from "../modal/ModalDeleteAdminCabang";
import ModalDetailAdminCabang from "../../components/modal/ModalDetailAdminCabang";
import Loading from "../../components/Loading"; // Keep this one
import axios from "axios";

export default function CompanyBranchCard() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const [modalState, setModalState] = useState({
    showModal: false,
    showDeleteModal: false,
    branchToDelete: null,
    showDetailModal: false,
    branchToDetail: null,
    branchToEdit: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBranches(response.data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayedBranches = branches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleViewDetail = (branch) => {
    setModalState({
      ...modalState,
      showDetailModal: true,
      branchToDetail: branch,
    });
  };

  const handleDeleteClick = (branch) => {
    setModalState({
      ...modalState,
      showDeleteModal: true,
      branchToDelete: branch,
    });
  };

  const handleDeleteBranch = async () => {
    try {
      await axios.delete(`/api/admin/${modalState.branchToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBranches(
        branches.filter((branch) => branch.id !== modalState.branchToDelete.id)
      );
      setModalState({
        ...modalState,
        showDeleteModal: false,
        branchToDelete: null,
      });
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleEditClick = (branch) => {
    setModalState({ ...modalState, showModal: true, branchToEdit: branch });
  };

  const handleCloseDeleteModal = () => {
    setModalState({
      ...modalState,
      showDeleteModal: false,
      branchToDelete: null,
    });
  };

  if (loading) return <Loading />; // Show loading until data is fetched

  return (
    <Card>
      <div className="mt-8 px-1 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Admin</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setModalState((prevState) => ({
                  ...prevState,
                  showModal: true,
                  branchToEdit: null,
                }))
              }
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Admin</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedBranches.map((branch) => {
            const cover = branch.foto?.find((f) => f.type === "cover");
            const profile = branch.foto?.find((f) => f.type === "profile");
            return (
              <div
                key={branch.id}
                className="bg-white border border-[#D5DBE7] rounded-lg w-full"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                      cover?.path
                    }`}
                    alt="Company Building"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                    <div className="rounded-full overflow-hidden border-2 border-white bg-white w-16 h-16">
                      <img
                        src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                          profile?.path
                        }`}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 px-3 pb-5">
                  {branch.user && (
                    <>
                      <h3 className="font-bold text-sm text-gray-800 text-center mb-2">
                        {branch.user.nama}
                      </h3>
                      <p className="text-xs text-black-600 text-center mb-1">
                        {branch.user.email}
                      </p>
                    </>
                  )}

                  <div className="flex justify-center mt-5">
                    <div className="border border-[#D5DBE7] rounded p-2 w-full flex justify-between items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(branch)} // Show modal on click
                        className="text-blue-500 border border-blue-500 rounded px-3 py-1 text-xs hover:bg-blue-50"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleEditClick(branch)} // Edit button click
                        className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(branch)} // Delete button click
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

        <div className="flex items-center justify-between mt-6">
          <div className="flex-1">
            <ReactPaginate
              previousLabel="← Sebelumnya"
              nextLabel="Berikutnya →"
              breakLabel="..."
              pageCount={Math.ceil(branches.length / itemsPerPage)}
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
      </div>

      <ModalTambahAdminCabang
        isOpen={modalState.showModal}
        onSucces={() => fetchAdmins()}
        onClose={() => setModalState({ showModal: false, branchToEdit: null })}
        branchToEdit={modalState.branchToEdit}
      />

      <ModalDeleteAdminCabang
        isOpen={modalState.showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteBranch}
      />
      <ModalDetailAdminCabang
        isOpen={modalState.showDetailModal}
        onClose={() => setModalState({ ...modalState, showDetailModal: false })}
        branch={modalState.branchToDetail}
      />
    </Card>
  );
}
