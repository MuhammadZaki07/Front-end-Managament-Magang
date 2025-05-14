import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Image, Upload } from "lucide-react";
import "../../components/cards/calendar-custom.css";

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

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [animateDetailModal, setAnimateDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const sampleParticipants = [
    [
      { id_peserta: 1, judul: "Laporan Mingguan", deskripsi: "Perkembangan proyek minggu ini", created_at: "2025-04-01T09:00:00", updated_at: "2025-04-01T10:30:00" },
      { id_peserta: 2, judul: "Meeting Sales", deskripsi: "Diskusi target penjualan bulan depan", created_at: "2025-04-01T11:00:00", updated_at: "2025-04-01T11:45:00" },
      { id_peserta: 3, judul: "Evaluasi Kinerja", deskripsi: "Review pencapaian Q1", created_at: "2025-04-01T13:30:00", updated_at: "2025-04-01T14:15:00" },
    ],
    [
      { id_peserta: 4, judul: "Training Product", deskripsi: "Pengenalan fitur baru aplikasi", created_at: "2025-04-08T13:00:00", updated_at: "2025-04-08T14:30:00" },
      { id_peserta: 5, judul: "Brainstorming", deskripsi: "Ide pengembangan produk baru", created_at: "2025-04-08T15:00:00", updated_at: "2025-04-08T15:45:00" },
      { id_peserta: 6, judul: "Review Desain", deskripsi: "Feedback mockup website", created_at: "2025-04-08T16:00:00", updated_at: "2025-04-08T16:30:00" },
      { id_peserta: 7, judul: "Daily Standup", deskripsi: "Update progress harian tim", created_at: "2025-04-08T09:00:00", updated_at: "2025-04-08T09:15:00" },
    ],
    [
      { id_peserta: 8, judul: "Presentasi Client", deskripsi: "Demo aplikasi kepada client potensial", created_at: "2025-04-15T10:00:00", updated_at: "2025-04-15T11:30:00" },
      { id_peserta: 9, judul: "Rapat Tim", deskripsi: "Koordinasi antar divisi", created_at: "2025-04-15T15:00:00", updated_at: "2025-04-15T16:00:00" },
    ],
    [
      { id_peserta: 10, judul: "Workshop UI/UX", deskripsi: "Pelatihan desain interface", created_at: "2025-04-11T14:00:00", updated_at: "2025-04-11T16:00:00" },
      { id_peserta: 11, judul: "Perencanaan Sprint", deskripsi: "Penetapan target sprint berikutnya", created_at: "2025-04-11T10:00:00", updated_at: "2025-04-11T11:30:00" },
      { id_peserta: 12, judul: "Code Review", deskripsi: "Review pull request anggota tim", created_at: "2025-04-11T13:00:00", updated_at: "2025-04-11T14:00:00" },
      { id_peserta: 13, judul: "Retrospective", deskripsi: "Evaluasi sprint sebelumnya", created_at: "2025-04-11T16:30:00", updated_at: "2025-04-11T17:30:00" },
      { id_peserta: 14, judul: "One-on-One", deskripsi: "Feedback pribadi dengan manager", created_at: "2025-04-11T09:00:00", updated_at: "2025-04-11T09:30:00" },
    ],
    [
      { id_peserta: 15, judul: "Diskusi Strategi", deskripsi: "Perencanaan strategi pemasaran", created_at: "2025-04-11T11:00:00", updated_at: "2025-04-11T12:30:00" },
      { id_peserta: 16, judul: "Interview Kandidat", deskripsi: "Wawancara calon karyawan baru", created_at: "2025-04-11T14:00:00", updated_at: "2025-04-11T15:00:00" },
    ],
    [
      { id_peserta: 17, judul: "Onboarding", deskripsi: "Orientasi karyawan baru", created_at: "2025-04-12T09:00:00", updated_at: "2025-04-12T10:30:00" },
      { id_peserta: 18, judul: "Tech Talk", deskripsi: "Sharing knowledge teknologi terbaru", created_at: "2025-04-12T13:30:00", updated_at: "2025-04-12T14:30:00" },
      { id_peserta: 19, judul: "Hackathon Prep", deskripsi: "Persiapan tim untuk hackathon", created_at: "2025-04-12T15:00:00", updated_at: "2025-04-12T16:00:00" },
    ],
  ];
  const [events, setEvents] = useState([
    {
      title: "Mengisi",
      start: "2025-04-01",
      allDay: true,
      backgroundColor: "#ECF2FE", // Yellow for online
      textColor: "#0069AB",
      borderColor: "#ECF2FE",
    },
    {
      title: "Tidak Mengisi",
      start: "2025-04-08",
      backgroundColor: "#FEE2E2", // Blue for offline
      textColor: "#EA5455",
      borderColor: "#E6EFFF",
    },
  ]);
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
    if (file) {
      setSelectedFile(file);

      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
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
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
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

  const handleOutsideDetailClick = (e) => {
    // Check if the click is outside the modal content
    if (e.target.classList.contains("modal-overlay")) {
      closeDetailModal();
    }
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => {
      setShowModal(false);
      // Reset form data
      setFormData({
        title: "",
        quota: "",
        startTime: "",
        endTime: "",
        zoomLink: "",
        location: "",
      });
      setSelectedStatus("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }, 300); // Match the duration of the transition
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get current date from calendar
    const calendarApi = calendarRef.current.getApi();
    const currentDate = calendarApi.getDate();

    // Format the date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split("T")[0];

    // Set the background and text colors based on the selected status
    let backgroundColor, textColor, borderColor;

    if (selectedStatus === "online") {
      backgroundColor = "#FEF9C3"; // Yellow for online
      textColor = "#CA8A04";
      borderColor = "#FEF9C3";
    } else {
      backgroundColor = "#E6EFFF"; // Blue for offline
      textColor = "#3B82F6";
      borderColor = "#E6EFFF";
    }

    // Create the new event
    const newEvent = {
      title: formData.title,
      start: formattedDate,
      backgroundColor,
      textColor,
      borderColor,
      extendedProps: {
        status: selectedStatus,
        quota: formData.quota,
        startTime: formData.startTime,
        endTime: formData.endTime,
        zoomLink: formData.zoomLink,
        location: formData.location,
        participants: [], // Start with empty participants list
        fileData: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              preview: previewUrl,
            }
          : null,
      },
    };

    // Add the new event to the events array
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    console.log("New event added:", newEvent);

    // Close the modal
    closeModal();
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
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
              <button className={`view-btn ${view === "day" ? "active" : ""}`} onClick={() => handleViewChange("day")}>
                Day
              </button>
              <button className={`view-btn ${view === "week" ? "active" : ""}`} onClick={() => handleViewChange("week")}>
                Week
              </button>
              <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => handleViewChange("month")}>
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay" onClick={handleOutsideClick}>
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-6 pb-4 border-b">
              <div>
                <h2 className="text-xl font-bold">Buat Jurnal</h2>
                <p className="text-gray-500 text-sm">Ayo Laporkan Kegiatanmu hari ini!</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Masukkan Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Judul Disini"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Masukkan Bukti<span className="text-red-500">*</span>
                </label>

                {/* Hidden file input */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png,image/jpeg" className="hidden" />

                {/* Show preview if file is selected */}
                {previewUrl ? (
                  <div className="mb-2 relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
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
                    <p className="text-gray-500 text-xs">PNG, JPEG (max 2mb size)</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500" value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Minimal Kata</span>
                  <span>{description.split(/\s+/).filter(Boolean).length}/150</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button type="button" className="px-6 py-2 rounded-lg bg-red-400 text-white font-medium hover:bg-red-500" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for event details */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay" onClick={handleOutsideDetailClick}>
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">William James Moriarty</h2>
                  <p className="text-gray-500 text-sm">SMK NEGERI 12 BOROWOOSO</p>
                </div>
                <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm mt-4 mb-2 font-medium">Bukti Kegiatan</p>
            </div>

            {/* Image */}
            <div className="w-full">
              <img src="/api/placeholder/800/400" alt="Bukti kegiatan" className="w-full h-48 object-cover" />
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-medium">Tanggal</p>
                <p className="text-sm text-gray-600">{selectedEvent.start ? selectedEvent.start.toISOString() : "2025-03-20 18:39:05"}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Kegiatan</p>
                <p className="text-sm text-gray-600">{selectedEvent.title || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end mt-6">
                <button className="px-6 py-2 rounded-full bg-orange-400 text-white font-medium hover:bg-orange-500">Edit</button>
                <button onClick={closeDetailModal} className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jurnal;
