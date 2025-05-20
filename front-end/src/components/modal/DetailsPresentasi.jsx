import React, { useState, useEffect } from "react";

const EventDetailModal = ({ show, onClose }) => {
  const [animateModal, setAnimateModal] = useState(false);
  
  // Sample event data based on the image
  const event = {
    title: "Detail Jadwal Presentasi",
    date: "Selasa, 1 April 2025",
    startTime: "10:00 AM",
    endTime: "13:00 AM",
    duration: "(3 jam)",
    status: "online",
    zoomLink: "https://zoom.us/j/123456789",
    participants: [
      { id: 1, name: "Gojo Satoru", photo: "/assets/img/Profil.png", projectStage: "Tahap Pengenalan", status: "hadir" },
      { id: 2, name: "Anya Forger", photo: "/assets/img/Profil.png", projectStage: "Tahap Dasar", status: "tidak hadir" },
      { id: 3, name: "Ron Kamonohashi", photo: "/assets/img/Profil.png", projectStage: "Tahap Pre Mini", status: "" },
      { id: 4, name: "Tomori Nao", photo: "/assets/img/Profil.png", projectStage: "Tahap Pengenalan", status: "" },
      { id: 5, name: "Cid Kagenou", photo: "/assets/img/Profil.png", projectStage: "Tahap Dasar", status: "" },
      { id: 6, name: "Megumi Fushiguro", photo: "/assets/img/Profil.png", projectStage: "Tahap Dasar", status: "" }
    ]
  };

  // Apply animation effect when modal opens
  useEffect(() => {
    if (show) {
      // Use setTimeout to allow the modal to render before animating
      setTimeout(() => {
        setAnimateModal(true);
      }, 10);
    } else {
      setAnimateModal(false);
    }
  }, [show]);

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration of the transition
  };

  const handleAttendanceChange = (participantId, status) => {
    console.log(`Changed participant ${participantId} status to ${status}`);
    // In a real app, this would update the state of the participants
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className={`bg-white w-full max-w-2xl rounded-lg transform transition-all duration-300 ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">{event.title}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-semibold mr-10">{event.date}</span>
              <span className="text-gray-800 font-semibold">{event.startTime}</span>
              <span className="text-gray-500 mx-1 font-semibold">→</span>
              <span className="text-gray-800 font-semibold">{event.endTime}</span>
              <span className="text-gray-500 text-sm font-semibold">{event.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <a href={event.zoomLink} className="text-blue-500 hover:underline">
              {event.zoomLink}
            </a>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Peserta Presentasi</h3>
              <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-sm">
                {event.participants.length}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {event.participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={participant.photo} 
                      alt={participant.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {participant.name}
                        <span className="text-xs text-gray-400">({participant.projectStage})</span>
                      </p>
                    </div>
                  </div>
                  
                  {participant.status === "hadir" ? (
                    <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Hadir
                    </span>
                  ) : participant.status === "tidak hadir" ? (
                    <span className="px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      Tidak Hadir
                    </span>
                  ) : (
                    <select 
                      defaultValue="" 
                      onChange={(e) => handleAttendanceChange(participant.id, e.target.value)}
                      className="px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Status Kehadiran</option>
                      <option value="hadir">Hadir</option>
                      <option value="tidak hadir">Tidak Hadir</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;