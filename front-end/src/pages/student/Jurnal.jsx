import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Image, Upload } from "lucide-react";
import "../../components/cards/calendar-custom.css";
import axios from "axios";
import dayjs from "dayjs";

const Jurnal = () => {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    kegiatan: "",
    bukti: null,
    created_at: "",
    updated_at: "",
  });
  const [editMode, setEditMode] = useState(false); // true saat klik edit
  const [selectedJournal, setSelectedJournal] = useState(null); // data jurnal yang akan diedit

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [animateDetailModal, setAnimateDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);

  const fetchJurnal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jurnal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jurnalData = response.data.data.map((jurnal) => ({
        id: jurnal.id,
        title: jurnal.judul,
        start: jurnal.tanggal,
        allDay: true,
        extendedProps: {
          deskripsi: jurnal.deskripsi,
          created_at: jurnal.created_at,
          bukti: jurnal.bukti?.path || null,
          originalData: jurnal,
        },
        backgroundColor: "#ECFDF5",
        textColor: "#059669",
        borderColor: "#D1FAE5",
      }));

      setEvents(jurnalData);
    } catch (error) {
      console.error("Gagal mengambil data jurnal", error);
    }
  };

  useEffect(() => {
    fetchJurnal();
  }, []);

  const formatMonthYear = (date) => {
    const options = { month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newDate = calendarApi.getDate();
      setCurrentDate(newDate);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      updateTitle();
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        bukti: "File harus berupa PNG atau JPEG.",
      }));
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, bukti: null }));
  };

  // Handler for clicking on the upload area
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handler for drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);

    // Map our simplified view names to FullCalendar view names
    const viewMap = {
      day: "timeGridDay",
      week: "timeGridWeek",
      month: "dayGridMonth",
    };

    // Change the calendar view
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMap[newView]);
      updateTitle();
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateTitle();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateTitle();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateTitle();
    }
  };

  // Handle dates changes
  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  // Handle event click to show detail modal
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowDetailModal(true);
    // Use setTimeout to allow the modal to render before animating
    setTimeout(() => {
      setAnimateDetailModal(true);
    }, 10);
  };

  // Modal handlers
  const handleAddEvent = () => {
    setShowModal(true);
    // Use setTimeout to allow the modal to render before animating
    setTimeout(() => {
      setAnimateModal(true);
    }, 10);
  };

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    // Check if the click is outside the modal content
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  // const handleOutsideDetailClick = (e) => {
  //   // Check if the click is outside the modal content
  //   if (e.target.classList.contains("modal-overlay")) {
  //     closeDetailModal();
  //   }
  // };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: "" });
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrors({});
    setEditMode(false);
    setSelectedJournal(null);
  };

  const closeDetailModal = () => {
    setAnimateDetailModal(false);
    setTimeout(() => {
      setShowDetailModal(false);
      setSelectedEvent(null);
    }, 300); // Match the duration of the transition
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Judul wajib diisi.";
    if (!description?.trim()) newErrors.description = "Deskripsi wajib diisi.";
    if (!selectedFile && !editMode) newErrors.bukti = "Bukti wajib diunggah."; // file tidak wajib saat edit
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const form = new FormData();
    form.append("judul", formData.title);
    form.append("deskripsi", description);
    if (selectedFile) form.append("bukti", selectedFile);

    // Edit: tambahkan method override
    if (editMode && selectedJournal) {
      form.append("_method", "PUT");
    }

    try {
      const token = localStorage.getItem("token");
      const url = editMode
        ? `${import.meta.env.VITE_API_URL}/jurnal/${selectedJournal.id}`
        : `${import.meta.env.VITE_API_URL}/jurnal`;

      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset state
      setFormData({ title: "" });
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setErrors({});
      setEditMode(false);
      setSelectedJournal(null);
      fetchJurnal();
      closeModal();
    } catch (error) {
      const backendErrors = error.response?.data?.meta;
      const statusCode = error.response?.status;

      // Tangani error 409 khusus (jurnal sudah diisi hari ini)
      if (statusCode === 409) {
        alert(error.response.data.message); // atau tampilkan dengan komponen notifikasi
        return;
      }
      const parsedErrors = {};
      if (backendErrors?.judul) parsedErrors.title = backendErrors.judul[0];
      if (backendErrors?.deskripsi)
        parsedErrors.description = backendErrors.deskripsi[0];
      if (backendErrors?.bukti) parsedErrors.bukti = backendErrors.bukti[0];
      if (backendErrors?.tanggal)
        parsedErrors.tanggal = backendErrors.tanggal[0];
      setErrors(parsedErrors);
      console.error("Submit error:", error);
    }
  };

  const handleEditClick = async (journal) => {
    if (!journal) return console.log("Data jurnal tidak ditemukan.");

    setShowModal(true);
    setShowDetailModal(false);
    setEditMode(true);
    setSelectedJournal(journal);
    setFormData({ title: journal.judul });
    setDescription(journal.deskripsi);

    const imageUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${
      journal.bukti.path
    }`;
    setPreviewUrl(imageUrl);
  };

  return (
    <div className="calendar-wrapper">
      {/* Header outside the card */}
      <div className="calendar-header">
        <div className="header-content">
          {/* Left section */}
          <div className="left-section">
            <button className="add-event-btn" onClick={handleAddEvent}>
              <span className="plus-icon">+</span> Tambah Jurnal
            </button>
            <h2 className="month-title">{formatMonthYear(currentDate)}</h2>
          </div>

          {/* Center section - Day Week Month */}
          <div className="center-section">
            <div className="view-options">
              <button
                className={`view-btn ${view === "day" ? "active" : ""}`}
                onClick={() => handleViewChange("day")}
              >
                Day
              </button>
              <button
                className={`view-btn ${view === "week" ? "active" : ""}`}
                onClick={() => handleViewChange("week")}
              >
                Week
              </button>
              <button
                className={`view-btn ${view === "month" ? "active" : ""}`}
                onClick={() => handleViewChange("month")}
              >
                Month
              </button>
            </div>
          </div>

          {/* Right section */}
          <div className="right-section">
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={handlePrev}>
                <span>‹</span>
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                <span>›</span>
              </button>
              <button className="today-btn" onClick={handleToday}>
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar inside the card */}
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          height="auto"
          dayMaxEvents={3}
          fixedWeekCount={false}
          firstDay={1} // Start week on Monday
          dayCellClassNames="calendar-day"
          dayHeaderClassNames="day-header"
          eventClassNames="calendar-event"
          aspectRatio={1.5}
          datesSet={handleDatesSet} // Listen for date changes
          eventClick={handleEventClick} // Listen for event clicks
        />
      </div>

      {/* Modal for adding event */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-6 pb-4 border-b">
              <div>
                <h2 className="text-xl font-bold">
                  {editMode ? "Edit Jurnal" : "Buat Jurnal"}
                </h2>
                {!editMode && (
                  <p className="text-gray-500 text-sm">
                    Ayo Laporkan Kegiatanmu hari ini!
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
              encType="multipart/form-data"
            >
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Masukkan Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Masukkan Judul Disini"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Masukkan Bukti <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="mb-2 relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border border-gray-200 bg-blue-50 rounded flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="text-gray-700 mb-2">
                      <Upload size={32} />
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span>Drag or </span>
                      <span className="text-blue-500">Browse</span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      PNG, JPEG (max 2mb size)
                    </p>
                  </div>
                )}
                {errors.bukti && (
                  <p className="text-red-500 text-sm mt-1">{errors.bukti}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full border rounded px-3 py-2 h-28 focus:outline-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Minimal Kata</span>
                  <span>
                    {description.split(/\s+/).filter(Boolean).length}/150
                  </span>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-red-400 text-white font-medium hover:bg-red-500"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                  <p className="text-gray-500 text-sm">
                    SMK NEGERI 12 BOROWOOSO
                  </p>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm mt-4 mb-2 font-medium">Bukti Kegiatan</p>
            </div>

            <div className="w-full">
              <img
                src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                  selectedEvent.extendedProps?.bukti
                }`}
                alt="Bukti kegiatan"
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-medium">Tanggal</p>
                <p className="text-sm text-gray-600">
                  {selectedEvent.startStr}
                </p>
              </div>

              <div className="overflow-y-auto h-auto">
                <p className="text-sm font-medium mb-1">Kegiatan</p>
                <p className="text-sm text-gray-600">
                  {selectedEvent.extendedProps?.deskripsi?.length > 200 &&
                  !showFullDescription
                    ? `${selectedEvent.extendedProps.deskripsi.slice(
                        0,
                        200
                      )}...`
                    : selectedEvent.extendedProps?.deskripsi}
                </p>
                {selectedEvent.extendedProps?.deskripsi?.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-500 text-sm mt-1 hover:underline"
                  >
                    {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                  </button>
                )}
              </div>

              {/* Tombol hanya tampil jika belum lewat 24 jam */}
              {(() => {
                const createdAt = new Date(
                  selectedEvent.extendedProps?.created_at
                );
                const now = new Date();
                const selisihJam = (now - createdAt) / (1000 * 60 * 60);

                return selisihJam < 24 ? (
                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={() =>
                        handleEditClick(
                          selectedEvent?.extendedProps.originalData
                        )
                      }
                      className="px-6 py-2 rounded-full bg-orange-400 text-white font-medium hover:bg-orange-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={closeDetailModal}
                      className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                      Tutup
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={closeDetailModal}
                      className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                      Tutup
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurnal;
