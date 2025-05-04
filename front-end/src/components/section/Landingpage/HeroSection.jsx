import { useState } from "react";
import Button from "../../Button";

const HeroSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div
      className="relative px-14 py-20 flex items-center gap-10 w-full bg-gradient-to-br from-blue-100 to-white"
      id="hero"
    >
      <div className="text-left">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Sistem Manajemen Magang <br /> Terbaik untuk Perusahaan Anda
        </h1>
        <p className="text-2xl text-blue-600 font-bold mt-2">
          Kelola Program Magang dengan Mudah & Efektif
        </p>
        <p className="text-gray-600 mt-4 text-lg font-normal">
          Bantu perusahaan Anda mengelola program magang dengan sistem yang
          terintegrasi. Dari pendaftaran, pemantauan, hingga evaluasi, semuanya
          dapat dilakukan dalam satu platform.
        </p>
        <div className="w-44">
          <Button icon={`bi-rocket-takeoff`} color={`blue`} size_rounded={`xl`}>
            GET STARTED
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <img
          src="assets/img/Hero.png"
          alt="hero"
          className="rounded-lg w-5/6"
        />
      </div>
      <div className="absolute z-50 grid grid-cols-3 gap-5 px-14 right-0 left-0 -bottom-10">
        <div
          className={`group w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card1")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-1.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl group-hover:text-white">
              Over 18+ Million Students
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              We provide online learning program that enable learners to access.
            </p>
          </div>
        </div>

        <div
          className={`w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 
          ${hoveredCard ? "bg-white text-gray-900" : "bg-blue-600 text-white"}`}
        >
          <img
            src="assets/icons/service-icon-2-2.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 animate-flip"
          />
          <div>
            <h1 className="font-semibold text-lg">6354+ Online Courses</h1>
            <p className="font-light text-sm">
              Online education provides flexibility and accessibility to
              learners.
            </p>
          </div>
        </div>

        <div
          className={`group w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card3")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-3.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div>
            <h1 className="font-semibold text-lg group-hover:text-white">
              Live Time Access
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              We provide online learning program that enable learners to access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
