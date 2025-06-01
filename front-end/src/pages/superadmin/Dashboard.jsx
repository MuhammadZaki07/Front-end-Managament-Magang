import React from "react";
import Card from "../../components/cards/Card";
import CardsSuperadmin from "../../components/cards/CardsSuperadmin";
import StatistikPeserta from "../../components/charts/StatistikPeserta";
import ChartLowongan from "../../components/charts/ChartLowongan";
import Perusahaanterdaftar from "../../components/cards/Perusahaanterdaftar";
import PesertaAksiChart from "../../components/charts/PesertaAksiChart";
import CabangTerdaftar from "../../components/cards/CabangTerdaftar";
import DivisiTerdata from "../../components/charts/DivisiTerdaftar";

const MentorDashboard = () => {
  return (
    <div className="w-full h-full pb-10">
      {/* GreetingsBox yang full width */}
      <div className="w-full">
        <CardsSuperadmin />
      </div>
      
      <div className="flex w-full gap-2 items-start h-full mb-6">
        <div className="flex-[8] w-60 flex flex-col gap-2 h-[450px]">
          <div className="flex-1 h-15">
            <StatistikPeserta />
          </div>
        </div>
        <div className="flex-[4] w-60 flex flex-col gap-2 h-[450px]">
          <div className="flex-1 h-20">
            <Perusahaanterdaftar />
          </div>
        </div>
        
        {/* Chart Lowongan dan DivisiTerdata dalam satu kolom full height */}
        <div className="flex-[1] flex flex-col gap-2 h-[450px]">
          <Card className="px-1 py-1 flex-1">
            <ChartLowongan />
          </Card>
        </div>
      </div>
      
      <div className="flex w-full gap-2 items-stretch h-full">
        <div className="flex-[6] w-60 flex flex-col gap-2 h-[350px]">
          <div className="flex-1 h-15">
            <PesertaAksiChart />
          </div>
        </div>
        <div className="flex-[3] w-60 flex flex-col gap-2 h-[350px]">
          <div className="flex-1 h-15">
            <CabangTerdaftar />
          </div>
        </div>
        <div className="flex-[4] w-60 flex flex-col gap-2 h-[350px]">
          <div className="flex-1 h-20">
            <StatistikPeserta />
          </div>
        </div>
        
        {/* DivisiTerdata di bawah ChartLowongan dalam kolom yang sama */}
        <div className="flex-[1] flex flex-col gap-2 h-[350px]">
          <Card className="px-1 py-1 flex-1">
            <DivisiTerdata />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;