import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import Swal from "sweetalert2";

export default function ScheduleCard() {
  const API_URL = `${import.meta.env.VITE_API_URL}/jam-kantor`;
  const [days, setDays] = useState({
    senin: false,
    selasa: false,
    rabu: false,
    kamis: false,
    jumat: false,
  });
  const [scheduleData, setScheduleData] = useState({
    senin: { active: false, exists: false },
    selasa: { active: false, exists: false },
    rabu: { active: false, exists: false },
    kamis: { active: false, exists: false },
    jumat: { active: false, exists: false },
  });

  const initialTimes = {
    masuk: { start: "08:00", end: "09:00" },
    istirahat: { start: "12:00", end: "13:00" },
    kembali: { start: "13:00", end: "13:30" },
    pulang: { start: "17:00", end: "18:00" },
  };

  const [times, setTimes] = useState({
    senin: { ...initialTimes },
    selasa: { ...initialTimes },
    rabu: { ...initialTimes },
    kamis: { ...initialTimes },
    jumat: { ...initialTimes },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const normalizeTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const toDot = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const mapTimesToPayloadFromTimes = (day, timesObj) => {
    const t = timesObj[day];
    return {
      hari: day,
      awal_masuk: normalizeTime(t.masuk.start),
      akhir_masuk: normalizeTime(t.masuk.end),
      awal_istirahat: normalizeTime(t.istirahat.start),
      akhir_istirahat: normalizeTime(t.istirahat.end),
      awal_kembali: normalizeTime(t.kembali.start),
      akhir_kembali: normalizeTime(t.kembali.end),
      awal_pulang: normalizeTime(t.pulang.start),
      akhir_pulang: normalizeTime(t.pulang.end),
    };
  };

  const mapTimesToPayload = (day) => {
    const t = times[day] || initialTimes;
    return {
      hari: day,
      awal_masuk: normalizeTime(t.masuk.start),
      akhir_masuk: normalizeTime(t.masuk.end),
      awal_istirahat: normalizeTime(t.istirahat.start),
      akhir_istirahat: normalizeTime(t.istirahat.end),
      awal_kembali: normalizeTime(t.kembali.start),
      akhir_kembali: normalizeTime(t.kembali.end),
      awal_pulang: normalizeTime(t.pulang.start),
      akhir_pulang: normalizeTime(t.pulang.end),
    };
  };

  const hasEmptyFields = (payload) => {
    return Object.values(payload).some((val) => val === "");
  };

  const updateSchedule = async (day, newTimes) => {
    const payload = mapTimesToPayloadFromTimes(day, newTimes);

    if (hasEmptyFields(payload)) {
      console.warn("Tidak mengirim PUT karena masih ada waktu kosong.");
      return;
    }

    try {
      await axios.put(`${API_URL}/${day}`, payload, { headers });
      setErrors((prev) => ({ ...prev, [day]: {} }));
      await fetchData(); // fetch ulang data setelah update berhasil
    } catch (err) {
      console.error("PUT error:", err);
      const apiErrors = err.response?.data?.meta || {};
      setErrors((prev) => ({ ...prev, [day]: apiErrors }));
    }
  };

  const toggleDay = async (day) => {
    const current = scheduleData[day];
    const isActive = !current.active; // toggle status
    const exists = current.exists;

    if (!exists) {
      // Data belum ada di DB, kirim POST
      const payload = mapTimesToPayload(day);

      if (hasEmptyFields(payload)) {
        alert("Harap lengkapi semua waktu sebelum mengaktifkan hari.");
        return;
      }

      try {
        await axios.post(API_URL, payload, { headers });
      } catch (err) {
        console.error("Gagal membuat data jam kantor:", err);
        const apiErrors = err.response?.data?.meta || {};
        setErrors((prev) => ({ ...prev, [day]: apiErrors }));
        return;
      }
    } else {
      // Data sudah ada, tinggal toggle status
      const url = isActive
        ? `${API_URL}/${day}/aktif`
        : `${API_URL}/${day}/nonaktif`;

      try {
        await axios.put(url, null, { headers });
      } catch (err) {
        console.error("Gagal mengubah status aktif/nonaktif:", err);
        const apiErrors = err.response?.data?.meta || {};
        setErrors((prev) => ({ ...prev, [day]: apiErrors }));
        return;
      }
    }

    // Setelah semua operasi, fetch ulang data biar state paling baru dari backend
    await fetchData();
  };

  const updateTime = (day, type, field, value) => {
    setTimes((prev) => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [type]: {
            ...prev[day][type],
            [field]: value,
          },
        },
      };

      // Pastikan data baru langsung diupdate ke backend
      if (days[day]) {
        updateSchedule(day, updated); // Kirim updated times ke updateSchedule
      }

      return updated;
    });
  };

  const renderTimeInput = (day, type, field) => {
    const value = times[day][type][field];
    const timeKey = `${field}_${type}`;
    const errorMsg = errors[day]?.[timeKey]?.[0];
    const isDisabled = !days[day]; // Disabled when day is inactive

    return (
      <div className="relative" key={`${day}-${type}-${field}`}>
        <select
          className={`w-full p-2 border ${
            errorMsg ? "border-red-500" : "border-gray-200"
          } rounded-md appearance-none bg-white text-sm h-10 ${
            isDisabled ? "cursor-not-allowed bg-gray-100" : ""
          }`}
          value={value}
          onChange={(e) => updateTime(day, type, field, e.target.value)}
          disabled={isDisabled}
        >
          {/* Opsi waktu dari jam 7 pagi hingga 10 malam */}
          {[...Array(16)].map((_, i) => {
            const hour = 7 + i; // mulai dari jam 7
            return (
              <>
                <option value={`${hour.toString().padStart(2, "0")}:00`}>
                  {hour.toString().padStart(2, "0")}:00
                </option>
                <option value={`${hour.toString().padStart(2, "0")}:15`}>
                  {hour.toString().padStart(2, "0")}:15
                </option>
                <option value={`${hour.toString().padStart(2, "0")}:30`}>
                  {hour.toString().padStart(2, "0")}:30
                </option>
                <option value={`${hour.toString().padStart(2, "0")}:45`}>
                  {hour.toString().padStart(2, "0")}:45
                </option>
              </>
            );
          })}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
      </div>
    );
  };

  const dayNames = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jum'at",
  };

  const fetchData = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const res = await axios.get(API_URL, { headers });
      const allDays = ["senin", "selasa", "rabu", "kamis", "jumat"];
      const updatedScheduleData = {};
      const updatedTimes = { ...times };

      allDays.forEach((day) => {
        updatedScheduleData[day] = { active: false, exists: false };
        updatedTimes[day] = { ...initialTimes };
      });

      if (res.data && Array.isArray(res.data.data)) {
        res.data.data.forEach((entry) => {
          updatedScheduleData[entry.hari] = {
            active: entry.status === true || entry.status === 1,
            exists: true,
          };
          updatedTimes[entry.hari] = {
            masuk: {
              start: entry.awal_masuk,
              end: entry.akhir_masuk,
            },
            istirahat: {
              start: entry.awal_istirahat,
              end: entry.akhir_istirahat,
            },
            kembali: {
              start: entry.awal_kembali,
              end: entry.akhir_kembali,
            },
            pulang: {
              start: entry.awal_pulang,
              end: entry.akhir_pulang,
            },
          };
        });
      }

      setScheduleData(updatedScheduleData);
      setTimes(updatedTimes);

      const updatedDays = {};
      Object.keys(updatedScheduleData).forEach((day) => {
        updatedDays[day] = updatedScheduleData[day].active;
      });
      setDays(updatedDays);
      Swal.close();
    } catch (error) {
      console.error("Gagal ambil data jam kantor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const DayCard = ({ day }) => {
    return (
      <div className="bg-white rounded-lg shadow-[2px_4px_6px_rgba(0,0,0,0.1)] overflow-hidden mb-4 w-full relative">
        <div className="p-4 flex items-center bg-white-50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-6 rounded-full flex items-center ${
                days[day] ? "bg-blue-500" : "bg-gray-300"
              } relative cursor-pointer transition-colors`}
              onClick={() => toggleDay(day)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute ${
                  days[day] ? "right-1" : "left-1"
                } transition-transform`}
              ></div>
            </div>
            <h3 className="text-lg font-medium">{dayNames[day]}</h3>
          </div>
        </div>

        <div className={`p-4 ${!days[day] ? 'opacity-60' : ''}`}>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-24">
                  <label className={`text-gray-600 ${!days[day] ? 'text-gray-400' : ''}`}>Masuk</label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full">{renderTimeInput(day, "masuk", "start")}</div>
                  <span className="mx-1">-</span>
                  <div className="w-full">{renderTimeInput(day, "masuk", "end")}</div>
                  </div>

                {/* <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/24/24" 
                    alt="clock" 
                    className="w-6 h-6 opacity-70"
                  />
                </div> */}
                <img 
    src="/assets/svg/clock.svg" 
    alt="clock" 
    className="w-23 h-23 absolute top-1 right-1"
  />
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-24">
                  <label className={`text-gray-600 ${!days[day] ? 'text-gray-400' : ''}`}>Istirahat</label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full">{renderTimeInput(day, "istirahat", "start")}</div>
                  <span className="mx-1">-</span>
                  <div className="w-full">{renderTimeInput(day, "istirahat", "end")}</div>
                  </div>
                {/* <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/24/24" 
                    alt="clock" 
                    className="w-6 h-6 opacity-70"
                  />
                </div> */}
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-24">
                  <label className={`text-gray-600 ${!days[day] ? 'text-gray-400' : ''}`}>Kembali</label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full">{renderTimeInput(day, "kembali", "start")}</div>
                  <span className="mx-1">-</span>
                  <div className="w-full">{renderTimeInput(day, "kembali", "end")}</div>
                  </div>
                {/* <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/24/24" 
                    alt="clock" 
                    className="w-6 h-6 opacity-70"
                  />
                </div> */}
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-24">
                  <label className={`text-gray-600 ${!days[day] ? 'text-gray-400' : ''}`}>Pulang</label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full">{renderTimeInput(day, "pulang", "start")}</div>
                  <span className="mx-1">-</span>
                  <div className="w-full">{renderTimeInput(day, "pulang", "end")}</div>
                  </div>
                {/* <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/24/24" 
                    alt="clock" 
                    className="w-6 h-6 opacity-70"
                  />
                </div> */}
              </div>
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(days).map((day) => (
          <DayCard key={day} day={day} />
        ))}
      </div>
    </div>
  );
}