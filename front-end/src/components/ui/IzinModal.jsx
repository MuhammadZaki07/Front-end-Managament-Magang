import React, { useState } from "react";
import Modal from "../Modal";
import Card from "../cards/Card";

const IzinModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("sakit");

  const handleFileChange = (e) => setFile(URL.createObjectURL(e.target.files[0]));

  const handleSubmit = () => {
    console.log("Form Submitted", { startDate, endDate, file, description, status });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Form Izin" size="large">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium">Mulai Izin</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Selesai Izin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
             className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
          />
        </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Bukti Izin (Gambar)</label>
          <input
            type="file"
            onChange={handleFileChange}
           className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
          />
          {file && (
            <div className="mt-4">
              <Card className="p-4 bg-indigo-50">
                <img src={file} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              </Card>
            </div>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
            placeholder="Masukkan deskripsi izin..."
          ></textarea>
        </div>

          <label className="block text-sm font-medium mb-2">Status</label>
        <div className="mb-4 flex justify-start gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="sakit"
              name="status"
              value="sakit"
              checked={status === "sakit"}
              onChange={() => setStatus("sakit")}
              className="w-4 h-4 text-purple-600"
            />
            <label htmlFor="sakit" className="ml-2 text-sm">Sakit</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="izin"
              name="status"
              value="izin"
              checked={status === "izin"}
              onChange={() => setStatus("izin")}
              className="w-4 h-4 text-purple-600"
            />
            <label htmlFor="izin" className="ml-2 text-sm">Izin</label>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-200 font-light text-red-500 rounded-full hover:bg-red-700"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-200 font-light text-green-500 rounded-full hover:bg-green-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IzinModal;
