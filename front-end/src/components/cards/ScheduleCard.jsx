import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export default function ScheduleCard() {
  const API_URL = `${import.meta.env.VITE_API_URL}/jam-kantor`;
  const [days, setDays] = useState({
    senin: false,
    selasa: false,
    rabu: false,
    kamis: false,
    jumat: false,
  });

  const initialTimes = {
    masuk: { start: "08.00", end: "09.00" },
    istirahat: { start: "10.00", end: "11.00" },
    kembali: { start: "12.00", end: "13.00" },
    pulang: { start: "17.00", end: "18.00" },
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

  const normalizeTime = (time) => time.replace(".", ":");
  const toDot = (time) => time.replace(":", ".");

  const mapTimesToPayload = (day) => {
    const t = times[day];
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
    setLoading((prev) => ({ ...prev, [day]: true }));
    const payload = mapTimesToPayload(day);

    if (hasEmptyFields(payload)) {
      alert("Harap lengkapi semua waktu sebelum mengaktifkan hari.");
      setLoading((prev) => ({ ...prev, [day]: false }));
      return;
    }

    try {
      console.log("POST payload:", payload);
      const res = await axios.post(API_URL, payload, { headers });
      console.log("POST response:", res.data);
      setErrors((prev) => ({ ...prev, [day]: {} }));
    } catch (err) {
      const apiErrors = err.response?.data?.meta || {};
      setErrors((prev) => ({ ...prev, [day]: apiErrors }));
    }

    setLoading((prev) => ({ ...prev, [day]: false }));
  };

  const updateSchedule = async (day) => {
    setLoading((prev) => ({ ...prev, [day]: true }));
    const payload = mapTimesToPayload(day);

    if (hasEmptyFields(payload)) {
      console.warn("Tidak mengirim PUT karena masih ada waktu kosong.");
      setLoading((prev) => ({ ...prev, [day]: false }));
      return;
    }

    try {
      console.log("PUT payload:", payload);
      const res = await axios.put(`${API_URL}/${day}`, payload, { headers });
      console.log("PUT response:", res.data);
      setErrors((prev) => ({ ...prev, [day]: {} }));
    } catch (err) {
      const apiErrors = err.response?.data?.meta || {};
      setErrors((prev) => ({ ...prev, [day]: apiErrors }));
    } finally {
      setLoading((prev) => ({ ...prev, [day]: false }));
    }
  };

  const deleteSchedule = async (day) => {
    try {
      await axios.delete(`${API_URL}/${day}`, { headers });
      setErrors((prev) => ({ ...prev, [day]: {} }));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDay = async (day) => {
    const isActive = !days[day];
    setDays((prev) => ({ ...prev, [day]: isActive }));

    if (isActive) {
      await postSchedule(day); // Menambahkan atau memperbarui data jika diaktifkan
    } else {
      await deleteSchedule(day); // Menghapus data jika dinonaktifkan
    }
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

      // Setelah setState selesai, kirim update (harus async pakai setTimeout)
      if (days[day]) {
        setTimeout(() => {
          console.log("Mengirim updateSchedule untuk", day);
          updateSchedule(day);
        }, 0); // tunggu re-render
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL, { headers });
        console.log("Data dari API:", res.data);

        const allDays = ["senin", "selasa", "rabu", "kamis", "jumat"];
        const fetchedDays = {};
        const updatedTimes = { ...times };

        // Set semua hari default ke tidak aktif
        allDays.forEach((day) => {
          fetchedDays[day] = false;
          updatedTimes[day] = { ...initialTimes };
        });

        // Jika ada data dari backend, override
        if (res.data && Array.isArray(res.data.data)) {
          res.data.data.forEach((entry) => {
            fetchedDays[entry.hari] = true;
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

        setDays(fetchedDays);
        setTimes(updatedTimes);
      } catch (error) {
        console.error("Gagal ambil data jam kantor:", error);
      }
    };

    fetchData();
  }, [API_URL]);

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
