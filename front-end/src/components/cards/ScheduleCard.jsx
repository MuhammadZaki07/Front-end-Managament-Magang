import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Loading from "../Loading";

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
  const [loading, setLoading] = useState({});
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

  const postSchedule = async (day) => {
    const payload = mapTimesToPayload(day);
    console.log("Payload yang dikirim:", payload); // Debugging log

    try {
      const res = await axios.post(API_URL, payload, { headers });
      console.log("Response dari server:", res.data);
    } catch (err) {
      console.error("Error saat mengirim POST:", err);
    }
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

    return (
      <div className="mb-2" key={`${day}-${type}-${field}`}>
        <input
          type="time"
          className={`w-full px-2 py-1 text-sm border ${
            errorMsg ? "border-red-500" : "border-gray-300"
          } rounded-md focus:ring-indigo-500`}
          value={normalizeTime(value)}
          onChange={(e) => updateTime(day, type, field, toDot(e.target.value))}
        />
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

  return (
    <div className="bg-white-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        {Object.keys(days).map((day) => (
          <div key={day} className="border border-gray-200 rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-4 rounded-full flex items-center ${
                    days[day] ? "bg-indigo-600" : "bg-gray-300"
                  } relative cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => toggleDay(day)}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full absolute ${
                      days[day] ? "right-0.5" : "left-0.5"
                    } transition-all`}
                  ></div>
                </div>
                <span className="font-medium">{dayNames[day]}</span>
              </div>
              {days[day] && (
                <span className="text-sm text-blue-500">Aktif</span>
              )}
            </div>
            {days[day] && (
              <div className="flex flex-col gap-3 mt-3">
                <div className="grid grid-cols-7 gap-2">
                  <div className="col-span-2">
                    {[
                      "Jam Masuk",
                      "Jam Istirahat",
                      "Jam Kembali",
                      "Jam Pulang",
                    ].map((label) => (
                      <div key={label} className="mb-3">
                        <label className="text-xs font-medium">{label}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2">
                    {["masuk", "istirahat", "kembali", "pulang"].map((type) => (
                      <div key={`${day}-${type}-start`}>
                        {renderTimeInput(day, type, "start")}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="mb-2"></div>
                    ))}
                  </div>

                  <div className="col-span-2">
                    {["masuk", "istirahat", "kembali", "pulang"].map((type) => (
                      <div key={`${day}-${type}-end`}>
                        {renderTimeInput(day, type, "end")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
