import { useState } from "react";
import PresentationCard from "../../components/cards/PresentationCard";
import ModalApplyPresentation from "../../components/modal/ModalApplyPresentation";

const Presentasi = () => {
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedPresentation, setSelectedPresentation] = useState(null); // Store selected presentation

  const handleApplyClick = (item) => {
    setShowModal(true);
    setSelectedPresentation(item); // Set selected presentation data
  };

  const basePresentations = [
    {
      status: "Scheduled",
      title: "Pengenalan",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-yellow-500 bg-yellow-50",
    },
    {
      status: "Completed",
      title: "Dasar",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
    {
      status: "Completed",
      title: "Pre Mini Project",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
  ];

  const count = 5;

  const presentations = Array(count)
    .fill(basePresentations)
    .flat()
    .map((item, index) => ({
      ...item,
      title: `${item.title} ${index + 1}`, // Add index to the title for uniqueness
    }));

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {presentations.map((item, index) => (
          <PresentationCard
            key={index}
            item={item}
            buttonLabel="Apply Presentasi"
            onButtonClick={handleApplyClick}
          />
        ))}
      </div>

      {showModal && (
        <ModalApplyPresentation
          data={selectedPresentation}
          onClose={() => setShowModal(false)} // Close modal when the close button is clicked
          isOpen={showModal} // Pass modal state
        />
      )}
    </>
  );
};

export default Presentasi;
