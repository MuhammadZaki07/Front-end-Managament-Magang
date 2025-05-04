import Footer from "../components/Footer";
import AboutSection from "../components/section/Landingpage/AboutSection";
import CarierStart from "../components/section/Landingpage/CarierStart";
import Gallery from "../components/section/Landingpage/Gallery";
import HeroSection from "../components/section/Landingpage/HeroSection";
import InternshipDivisions from "../components/section/Landingpage/InternshipDivisions";
import InternshipLanding from "../components/section/Landingpage/InternshipLanding";
import MyPartner from "../components/section/Landingpage/MyPartner";
import StatsSection from "../components/section/Landingpage/StatsSection";
import Testimonials from "../components/section/Landingpage/Testimonials";

const Index = () => {
  return <>
    <HeroSection/>
    <AboutSection/>
    <InternshipDivisions/>
    <StatsSection/>
    <InternshipLanding/>
    <Gallery/>
    <CarierStart/>
    <MyPartner/>
    <Testimonials/>
  </>;
};

export default Index;
