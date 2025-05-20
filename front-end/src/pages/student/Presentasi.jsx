import { useState } from "react";
import ModalApplyPresentation from "../../components/modal/ModalApplyPresentation";

// Component PresentationCard with image background instead of colored pattern
const PresentationCard = ({ item, buttonLabel = "Apply Presentation", onButtonClick }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    {/* Header with image background - increased height to avoid cropping */}
    <div className="relative h-28 flex justify-between items-start">
      {/* Background image - no padding to ensure full coverage */}
      <img 
        src={item.backgroundImage} 
        alt="Presentation background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Content wrapper with padding - no overlay for cleaner look */}
      <div className="relative z-10 w-full p-4 flex justify-between items-start">
        <h3 className="text-lg font-semibold text-black">
          {item.title}
        </h3>
      </div>
    </div>

    {/* Status bar below image with border only at bottom */}
    {item.status && (
      <div className="py-2 px-4 border-b border-[#667797]">
        <span className="px-2 py-1 text-xs font-medium rounded text-white bg-blue-600">
          {item.status}
        </span>
      </div>
    )}

    {/* Content section */}
    <div className="p-4">
      {/* Date and time info on same line - with smaller than xs font */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-gray-600" style={{ fontSize: '0.65rem' }}>
          <div className="flex items-center">
            <i className="bi bi-calendar3 mr-1"></i>
            <span>{item.date}</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-clock mr-1"></i>
            <span>{item.time}</span>
          </div>
        </div>
      </div>

      {/* Apply button - more rounded */}
      <button
        onClick={() => onButtonClick?.(item)}
        className="w-full py-2 px-4 text-sm font-medium rounded-full border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors duration-200"
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);

// Main Presentation component
const Presentasi = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const handleApplyClick = (item) => {
    setShowModal(true);
    setSelectedPresentation(item);
  };

  // Background images for variation
  const backgroundImages = [
    "/assets/svg/BackgroundPresentasi.svg",
  ];

  const basePresentations = [
    {
      status: "Offline",
      title: "Presentasi Offline",
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
    },
    {
      status: "Offline",
      title: "Presentasi Offline", 
      date: "Selasa, 26 Maret 2025",
      time: "09:00 - 11:00 (2 Jam)",
    },
    {
      status: "Offline",
      title: "Presentasi Offline",
      date: "Rabu, 27 Maret 2025", 
      time: "13:00 - 15:00 (2 Jam)",
    },
    {
      status: "Offline",
      title: "Presentasi Offline",
      date: "Kamis, 28 Maret 2025",
      time: "10:00 - 12:00 (2 Jam)",
    }
  ];

  // Generate 16 cards (4 rows x 4 columns)
  const presentations = Array(16).fill(null).map((_, index) => ({
    ...basePresentations[index % basePresentations.length],
    id: index + 1,
    backgroundImage: backgroundImages[index % backgroundImages.length]
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bootstrap Icons CSS Link */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Jadwal Presentasi</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Grid for presentation cards - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {presentations.map((item, index) => (
            <PresentationCard
              key={index}
              item={item}
              buttonLabel="Apply Presentation"
              onButtonClick={handleApplyClick}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ModalApplyPresentation
          data={selectedPresentation}
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        />
      )}
    </div>
  );
};

export default Presentasi;