import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const EventDetailModal = ({ show, onClose, eventId }) => {
  const [animateModal, setAnimateModal] = useState(false);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [changedParticipants, setChangedParticipants] = useState(new Set()); // Track which participants have been changed

  // Fetch function - using direct async function instead of useCallback
  const fetchEventData = async (currentEventId) => {
    if (!currentEventId) {
      setError("Event ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Reset event data when starting new fetch
      setEvent(null);

      console.log("Fetching data for eventId:", currentEventId);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jadwal-presentasi/${currentEventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Raw API response for eventId", currentEventId, ":", response.data);

      if (response.data?.status === "success" && response.data?.data) {
        const apiData = response.data.data;
        console.log("API Data for eventId", currentEventId, ":", apiData);

        // Transform API data to match component structure
        const transformedEvent = {
          id: apiData.id,
          title: "Detail Jadwal Presentasi",
          date: formatDate(apiData.tanggal),
          startTime: formatTime(apiData.waktu_mulai),
          endTime: formatTime(apiData.waktu_selesai),
          duration: calculateDuration(apiData.waktu_mulai, apiData.waktu_selesai),
          status: apiData.tipe || "offline", // online/offline
          presentationStatus: apiData.status || "dijadwalkan", // dijadwalkan/selesai
          zoomLink: apiData.link_zoom || "",
          location: apiData.lokasi || "",
          kuota: apiData.kuota || 0,
          participants: Array.isArray(apiData.Peserta)
            ? apiData.Peserta.map((peserta) => ({
                id: peserta.id, // This is the participant ID we need for updates
                pesertaId: peserta.peserta?.id, // This is the peserta UUID
                name: peserta.peserta?.nama || "Unknown",
                projectStage: peserta.projek || "",
                photo: getProfilePhoto(peserta.peserta?.foto),
                status: peserta.status, // Keep numeric status (0 or 1)
                hasBeenChanged: peserta.status !== null && peserta.status !== undefined, // Track if status has been set
              }))
            : [],
        };

        console.log("Setting transformed event for eventId", currentEventId, ":", transformedEvent);
        setEvent(transformedEvent);
      } else {
        setError("Failed to fetch event data: Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching event data for eventId", currentEventId, ":", err);

      // Better error handling
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Event not found.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil data presentasi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state and fetch data when eventId changes or modal opens/closes
  useEffect(() => {
    console.log("useEffect triggered - show:", show, "eventId:", eventId);

    if (show && eventId) {
      // Reset all states when opening modal with new eventId
      console.log("Resetting states and fetching data for eventId:", eventId);
      setEvent(null);
      setError(null);
      setIsLoading(false);
      setChangedParticipants(new Set()); // Reset changed participants tracking

      // Fetch new data with current eventId
      fetchEventData(eventId);
    } else if (!show) {
      // Reset all states when modal closes
      console.log("Modal closed, resetting states");
      setEvent(null);
      setError(null);
      setIsLoading(false);
      setChangedParticipants(new Set());
    }
  }, [show, eventId]); // Removed fetchEventData from dependency

  // Helper functions
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Tanggal tidak valid";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Waktu tidak valid";

      const [hours, minutes] = timeString.split(":");
      if (!hours || !minutes || isNaN(hours) || isNaN(minutes)) {
        return "Waktu tidak valid";
      }

      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Waktu tidak valid";
    }
  };

  const calculateDuration = (startTime, endTime) => {
    try {
      if (!startTime || !endTime) return "";

      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
        return "";
      }

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      const durationMinutes = endTotalMinutes - startTotalMinutes;

      if (durationMinutes <= 0) return "";

      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      if (hours > 0 && minutes > 0) {
        return `(${hours} jam ${minutes} menit)`;
      } else if (hours > 0) {
        return `(${hours} jam)`;
      } else {
        return `(${minutes} menit)`;
      }
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "";
    }
  };

  const getProfilePhoto = (fotoArray) => {
    const defaultPhoto = "/assets/img/Profil.png";

    if (!fotoArray || !Array.isArray(fotoArray) || fotoArray.length === 0) {
      return defaultPhoto;
    }

    try {
      const profilePhoto = fotoArray.find((foto) => foto?.type === "profile");
      if (profilePhoto?.path) {
        return `${import.meta.env.VITE_API_URL_FILE}/storage/${profilePhoto.path}`;
      }
      return defaultPhoto;
    } catch (error) {
      console.error("Error getting profile photo:", error);
      return defaultPhoto;
    }
  };

  // Apply animation effect when modal opens
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateModal(false);
    }
  }, [show]);

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => {
      onClose();
      // Reset state when modal closes
      setEvent(null);
      setError(null);
      setIsLoading(false);
      setChangedParticipants(new Set());
    }, 300);
  };

  const handleAttendanceChange = async (participantId, status) => {
    if (!participantId || (status !== 0 && status !== 1)) {
      alert("Data tidak lengkap untuk mengubah status kehadiran");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      console.log(`Updating participant ${participantId} status to ${status}`);

      // FIXED: Use the correct endpoint with participant ID
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/presentasi/${participantId}`,
        { status }, // Send numeric status (0 or 1)
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data?.status === "success") {
        // Update local state
        setEvent((prevEvent) => {
          if (!prevEvent) return prevEvent;

          return {
            ...prevEvent,
            participants: prevEvent.participants.map((participant) => (participant.id === participantId ? { ...participant, status, hasBeenChanged: true } : participant)),
          };
        });

        // Track that this participant has been changed
        setChangedParticipants((prev) => new Set([...prev, participantId]));

        console.log(`Successfully changed participant ${participantId} status to ${status}`);
        alert("Status kehadiran berhasil diubah!");
      } else {
        throw new Error(response.data?.message || "Failed to update attendance");
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal mengubah status kehadiran";
      alert(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    // Handle numeric status: 0 = tidak hadir, 1 = hadir
    const numericStatus = parseInt(status);

    const statusConfig = {
      1: {
        className: "px-3 py-1 text-[#16A34A] border border-[#16A34A] rounded-lg text-sm font-medium",
        text: "Hadir",
      },
      0: {
        className: "px-3 py-1 text-[#EA5455] border border-[#EA5455] rounded-lg text-sm font-medium",
        text: "Tidak Hadir",
      },
    };

    const config = statusConfig[numericStatus] || {
      className: "px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium",
      text: "Belum Diatur",
    };

    return <span className={config.className}>{config.text}</span>;
  };

  // Check if participant's status can be changed
  const canChangeStatus = (participant) => {
    return !participant.hasBeenChanged && !changedParticipants.has(participant.id);
  };

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && show) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={`bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg transform transition-all duration-300 ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-8">
              <div className="text-red-500 text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mb-4 font-medium">Error: {error}</p>
                <button onClick={() => fetchEventData(eventId)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : event ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">{event.title}</h2>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-2" aria-label="Close modal">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Date and Time */}
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-800 font-semibold mr-10">{event.date}</span>
                  <span className="text-gray-800 font-semibold">{event.startTime}</span>
                  <span className="text-gray-500 mx-1 font-semibold">→</span>
                  <span className="text-gray-800 font-semibold">{event.endTime}</span>
                  {event.duration && <span className="text-gray-500 text-sm font-semibold">{event.duration}</span>}
                </div>
              </div>

              {/* Link or Location */}
              {event.status === "online" && event.zoomLink && (
                <div className="flex items-start gap-2 mb-6">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <a href={event.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {event.zoomLink}
                  </a>
                </div>
              )}

              {event.status === "offline" && event.location && (
                <div className="flex items-start gap-2 mb-6">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-gray-800">{event.location}</span>
                </div>
              )}

              {/* Participants */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold">Peserta Presentasi</h3>
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-sm">{event.participants.length}</div>
                </div>

                <div className="space-y-4">
                  {event.participants.length > 0 ? (
                    event.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={participant.photo}
                            alt={participant.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = "/assets/img/Profil.png";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate">{participant.name}</p>
                            {participant.projectStage && <p className="text-sm text-blue-500 truncate">{participant.projectStage}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Show status badge if status has been set or changed */}
                          {(participant.hasBeenChanged || changedParticipants.has(participant.id) || (participant.status !== null && participant.status !== undefined)) && getStatusBadge(participant.status)}

                          {/* Show dropdown only if status can be changed */}
                          {canChangeStatus(participant) && (
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  handleAttendanceChange(participant.id, parseInt(e.target.value));
                                }
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="" disabled>
                                Status Kehadiran
                              </option>
                              <option value="1">Hadir</option>
                              <option value="0">Tidak Hadir</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p>Belum ada peserta terdaftar</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No event data available for ID: {eventId}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={handleClose} className="px-6 py-2 border border-[#0069AB] text-[#0069AB] rounded-full text-sm hover:bg-[#0069AB] hover:text-white transition-colors">
              Close
            </button>

            {event && event.presentationStatus === "dijadwalkan" && (
              <button
                onClick={() => {
                  console.log("Continue action for event:", event.id);
                }}
                className="px-6 py-2 border border-[#0069AB] text-[#0069AB] rounded-full text-sm hover:bg-[#0069AB] hover:text-white transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
