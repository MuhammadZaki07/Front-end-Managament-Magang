import Banner from "../components/Banner";
import Footer from "../components/Footer";
import About_us from "../components/section/section_abouts/About_us";
import Counter from "../components/section/section_abouts/Counter";
import Testimonials from "../components/section/section_abouts/testimonials";
import WhyUsSection from "../components/section/section_abouts/WhyUsSection";

const About = () => {
  return (
    <>
      <Banner
        title="ABOUT US"
        subtitle="Home → About Us"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />
      <About_us/>
      <WhyUsSection/>
      <Counter/>
      <Testimonials/>
    </>
  );
};

export default About;
