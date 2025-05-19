import React, { useEffect, useState } from "react";
import AlertVerification from "../../components/AlertVerification";
import Calendar from "../../components/Calendar";
import ChartStats from "../../components/charts/ChartStats";
import Card from "../../components/cards/Card";
import StaticJurnal from "../../components/charts/StaticJurnal";
import Title from "../../components/Title";
import RevisionCard from "../../components/cards/RevisionCard";
import ProjectStats from "../../components/charts/ProjectStats";
import { Link, useLocation } from "react-router-dom";
import PresentationCard from "../../components/cards/PresentationCard";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  localStorage.setItem("location", location.pathname);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [magangStatus, setMagangStatus] = useState(null);

  const checkDataStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/complete/peserta`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkMagangStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/complete/magang`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMagangStatus(res.data.data.status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDataStatus();
    checkMagangStatus();
  }, []);

  const statsData = [
    {
      title: "Total Absensi",
      value: "120",
      icon: "/assets/icons/absensi/book.png",
      color: "#3B82F6",
      data: [10, 15, 12, 18, 14, 20, 22, 19, 17, 25, 21, 23],
    },
    {
      title: "Total Kehadiran",
      value: "110",
      icon: "/assets/icons/absensi/certificateLogo.png",
      color: "#10B981",
      data: [8, 12, 15, 20, 18, 16, 19, 17, 22, 24, 20, 21],
    },
    {
      title: "Total Izin / Sakit",
      value: "30",
      icon: "/assets/icons/absensi/graduate.png",
      color: "#6366F1",
      data: [3, 5, 4, 6, 2, 3, 4, 2, 5, 3, 4, 5],
    },
    {
      title: "Total Terlambat",
      value: "18",
      icon: "/assets/icons/absensi/mens.png",
      color: "#F97316",
      data: [2, 4, 3, 5, 1, 2, 3, 2, 4, 3, 2, 3],
    },
  ];

  const dataRevision = [
    { title: "Revisi Tampilan", desc: "Due in 9 days" },
    { title: "Revisi Controller", desc: "Due in 9 days" },
    { title: "Revisi Bahasa", desc: "Due in 9 days" },
  ];

  const presentations = [
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

  if (loading)
    return (
      <div className="h-screen">
        <div className="w-full h-14 bg-slate-300 border border-slate-200 rounded-lg flex justify-between py-1 px-3 items-center mb-4 animate-pulse">
          <div className="bg-slate-400 w-1/3 h-5 rounded animate-pulse"></div>
          <div className="bg-slate-400 w-1/6 h-5 rounded animate-pulse"></div>
        </div>
      </div>
    );
    
  // Menampilkan halaman menunggu persetujuan jika status magang "false"
  if (magangStatus === "false") {
    return (
      <div className="w-full">
        <div className="w-xl mx-auto h-screen flex flex-col items-center justify-center">
          <img src="/assets/svg/Company-amico.svg" alt="Company-amico.svg" className="max-w-md" />
          <p className="text-lg font-medium text-gray-700 mt-4">
            Pengajuan magang Anda sedang menunggu persetujuan
          </p>
        </div>
      </div>
    );
  }
  
  // Kode ini hanya akan dijalankan jika magangStatus !== "false"
  return (
    <div className="w-full">
      {status === "false" ? (
        <>
          <AlertVerification />
          <div className="w-xl mx-auto h-screen">
            <img src="/assets/svg/Forms.svg" alt="Forms.svg" />
          </div>
        </>
      ) : (
        <div className="flex w-full gap-5">
          <div className="flex-[8] w-full">
            <Card className="mt-0">
              <div className="grid grid-cols-4 gap-3">
                {statsData.map((item, index) => (
                  <ChartStats
                    icon={item.icon}
                    value={item.value}
                    color={item.color}
                    title={item.title}
                    key={index + 1}
                    seriesData={item.data}
                  />
                ))}
              </div>
            </Card>
            <Card className="my-7">
              <StaticJurnal />
            </Card>
            <Card>
              <div className="flex justify-between items-center mb-4">
                <Title className="ml-3">Riwayat Presentasi</Title>
                <Link to={`#`} className="text-blue-500 text-sm mr-3">
                  See All
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {presentations.map((item, index) => (
                  <PresentationCard key={index} item={item} />
                ))}
              </div>
            </Card>
          </div>
          <div className="flex-[3] flex-col gap-5">
            <div className="bg-white w-full rounded-lg py-3 text-blue-400 text-sm text-center">
              Anda Sedang magang di Perusahaan Informatika Divisi Frontend
              Developer
            </div>
            <Calendar />
            <Card className="mt-3">
              <Title className="ml-1">Revisi</Title>
              <div className="flex flex-col">
                {dataRevision.map((item, i) => (
                  <RevisionCard
                    key={i + 1}
                    desc={item.desc}
                    title={item.title}
                  />
                ))}
              </div>
            </Card>
            <Card className="px-0 py-2 mb-3">
              <div className="border-b border-slate-400/[0.5] py-3">
                <Title className="ml-5">My Progress</Title>
              </div>
              <ProjectStats />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;