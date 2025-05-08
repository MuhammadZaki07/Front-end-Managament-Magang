import { useState } from "react";
import { X, Calendar, Upload } from "lucide-react";

export default function InternshipModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Simple DatePicker component
  const DatePicker = ({ selectedDate, onChange }) => {
    const today = new Date();
    const initialDate = selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : today;

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const renderCalendarDays = () => {
      const days = [];
      const blanks = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        blanks.push(<div key={`blank-${i}`} className="h-8 w-8"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isSelected = selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();

        days.push(
          <div
            key={day}
            onClick={() => onChange(new Date(currentYear, currentMonth, day))}
            className={`h-8 w-8 flex items-center justify-center cursor-pointer rounded-full
              ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
          >
            {day}
          </div>
        );
      }

      return [...blanks, ...days];
    };

    return (
      <div className="w-64">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            &lt;
          </button>
          <div className="font-medium">
            {months[currentMonth]} {currentYear}
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="h-8 w-8 font-medium text-xs flex items-center justify-center">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Pemberkasan Magang</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mulai Magang</label>
            <div className="relative">
              <input type="text" placeholder="dd/mm/yyyy" value={startDate} onClick={() => setShowStartCalendar(!showStartCalendar)} readOnly className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer" />
              <Calendar className="absolute right-3 top-2.5 text-gray-400 cursor-pointer" size={18} onClick={() => setShowStartCalendar(!showStartCalendar)} />

              {showStartCalendar && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={startDate ? new Date(startDate.split("/").reverse().join("-")) : new Date()}
                    onChange={(date) => {
                      setStartDate(formatDate(date));
                      setShowStartCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Selesai Magang</label>
            <div className="relative">
              <input type="text" placeholder="dd/mm/yyyy" value={endDate} onClick={() => setShowEndCalendar(!showEndCalendar)} readOnly className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer" />
              <Calendar className="absolute right-3 top-2.5 text-gray-400 cursor-pointer" size={18} onClick={() => setShowEndCalendar(!showEndCalendar)} />

              {showEndCalendar && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={endDate ? new Date(endDate.split("/").reverse().join("-")) : new Date()}
                    onChange={(date) => {
                      setEndDate(formatDate(date));
                      setShowEndCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Surat pernyataan Diri</label>
            <label className="flex flex-col">
              <div className="w-full border border-gray-300 rounded-md p-2 pl-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-500 truncate">{fileName || "Choose File"}</span>
                <div className="flex items-center space-x-1">
                  {!fileName && <span className="text-gray-500 text-sm">No File Chosen</span>}
                  <Upload size={18} className="text-gray-400" />
                </div>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <p className="text-red-500 text-xs mt-1">*File Harus Berformat .pdf, .doc, .jpg, .jpeg, atau .png</p>
            <button
              className="mt-2 text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
              onClick={() => {
                // Pada implementasi sebenarnya, URL ini akan mengarah ke endpoint backend yang menyajikan file
                const templateUrl = "/api/templates/surat-pernyataan-diri.docx";

                // Membuat link untuk download
                const link = document.createElement("a");
                link.href = templateUrl;
                link.download = "template_surat_pernyataan_diri.docx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Template Surat Pernyataan Diri
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-blue-700 transition-colors">Simpan</button>
            <button onClick={closeModal} className="bg-pink-100 text-pink-600 py-2 px-4 rounded-md flex-1 hover:bg-pink-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
