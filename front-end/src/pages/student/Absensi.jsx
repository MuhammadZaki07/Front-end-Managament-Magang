import React, { useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/cards/Card";
import CardAbsensi from "../../components/cards/CardAbsensi";
import TableAbsensi from "../../components/cards/TableAbsensi";
import IzinModal from "../../components/ui/IzinModal";

const Absensi = () => {
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);

  const dummyAbsensi = [
    {
      bgColor: "bg-indigo-500",
      Title: "Hadir",
      sum: 24,
      src: "graduate",
    },
    {
      bgColor: "bg-emerald-300",
      Title: "Izin",
      sum: 3,
      src: "certificateLogo",
    },
    {
      bgColor: "bg-sky-500",
      Title: "Alpa",
      sum: 2,
      src: "book",
    },
    {
      bgColor: "bg-orange-500",
      Title: "Terlambat",
      sum: 5,
      src: "mens",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-13 px-12">
        {dummyAbsensi.map((item, index) => (
          <CardAbsensi
            key={index}
            bgColor={item.bgColor}
            Title={item.Title}
            sum={item.sum}
            src={item.src}
          />
        ))}
      </div>
      <div className="mt-10 px-10">
        <div className="flex justify-end gap-2">
          <Button>Absen</Button>
          <Button
            bgColor="bg-orange-400"
            onClick={() => setIsIzinModalOpen(true)}
          >
            Izin
          </Button>
          <Button bgColor="bg-emerald-400">PDF</Button>
        </div>
        <TableAbsensi />
      </div>
      <IzinModal isOpen={isIzinModalOpen} onClose={() => setIsIzinModalOpen(false)} />
    </section>
  );
};

export default Absensi;
