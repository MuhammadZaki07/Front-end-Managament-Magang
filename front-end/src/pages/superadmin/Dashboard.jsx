import React from "react";
import Calendar from "../../components/Calendar";
import GreetingsBox from "../../components/cards/GreetingsBox";
import AssignmentsTable from "../../components/cards/AssignmentsTable";
import RecommendedSection from "../../components/cards/RecommendedSection";
import ActivityChart from "../../components/charts/ActivityChart";
import EventsSection from "../../components/cards/EventSection";
import TahapCard from "../../components/cards/TahapCards";
import Card from "../../components/cards/Card";
import Title from "../../components/Title";
import StudentsList from "../../components/cards/StudentList";
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
      
      <div className="flex w-full gap-2 items-stretch h-full">
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
        
        {/* Kalender + Events Section di Kanan */}
        <div className="flex-[1] flex flex-col gap-5 h-[450px] mt-5">
          <Card className="px-1 py-1 flex-1 h-full">
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
        
        {/* Kalender + Events Section di Kanan */}
         <div className="flex-[1] flex flex-col gap-5 h-[350px] mt-5">
          <Card className="px-1 py-1 flex-1 h-full">
            <DivisiTerdata />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;