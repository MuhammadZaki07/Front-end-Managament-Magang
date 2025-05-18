import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../../Button";
import LogoCompany from "../../LogoCompany";

const MyPartner = () => {
  const data = [
    { name: "airbnb", slug: "airbnb" },
    { name: "Amazon", slug: "amazon" },
    { name: "FeedEx", slug: "feedex" },
    { name: "Google", slug: "google" },
    { name: "HubSpot", slug: "hubspot" },
    { name: "Microsoft", slug: "microsoft" }
  ];

  const [width, setWidth] = useState(0);
  const carousel = useRef();

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  // Navigasi ke halaman detail partner
  const handleCompanyClick = (slug) => {
    window.location.href = `/partners/${slug}`;
  };

  // Logo dengan animasi hover dan klik
  const AnimatedLogo = ({ company }) => {
    return (
      <motion.div
        className="px-4 flex items-center justify-center min-w-40 cursor-pointer"
        whileHover={{ 
          scale: 1.1, 
          y: -10,
          filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.1))"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={(e) => {
          e.stopPropagation();
          handleCompanyClick(company.slug);
        }}
      >
        <LogoCompany titleLogo={company.name} />
      </motion.div>
    );
  };

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-44 bg-white overflow-hidden">
      <div className="space-y-3">
        <h1 className="uppercase text-2xl text-center text-color-blue font-bold">
          My Partner
        </h1>
        <p className="text-slate-800 text-center font-semibold text-xl">
          Tumbuh bersama Kolaborasi menuju kesuksesan
        </p>
      </div>

      {/* Carousel container */}
      <motion.div 
        ref={carousel} 
        className="cursor-grab overflow-x-hidden overflow-y-visible mt-8 border-y-2 border-slate-300/[0.5] py-12"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex"
          whileTap={{ cursor: "grabbing" }}
          animate={{
            x: [-width, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* Duplikasi logo agar scrolling loop terlihat mulus */}
          {[...data, ...data].map((company, index) => (
            <AnimatedLogo key={index} company={company} />
          ))}
        </motion.div>
      </motion.div>

      <div className="flex justify-center mt-8">
        <Button icon="bi-arrow-right" onClick={() => window.location.href = '/partners'}>
          Lihat semua mitra
        </Button>
      </div>
    </section>
  );
};

export default MyPartner;
