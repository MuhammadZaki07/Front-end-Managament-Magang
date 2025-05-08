import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Vacancy from "../components/section/Vacancy";


const lowongan = () => {
  return (
    <>
      <Banner
        title="VACANCY"
        subtitle="Home → Vacancy"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />
      <div className="pl-20">
              <Vacancy />
            </div>
    </>
  );
};

export default lowongan;
