import Banner from "../components/Banner";
import Card from "../components/cards/Card";
import Title from "../components/Title";

const Contact = () => {
  const data = [
    {
      title: "Our Address",
      desc: "2464 Royal Ln. Mesa, New Jersey 45463",
      icon: "bi-geo-alt-fill",
    },
    {
      title: "info@example.com",
      desc: "Email us anytime for anykind ofquety",
      icon: "bi-envelope-at",
    },
    {
      title: "Hot:+208-666-0112",
      desc: "Call us any kind suppor,we will wait for it",
      icon: "bi-telephone-inbound",
    },
  ];

  return (
    <>
      <Banner
        title="Contact Us"
        subtitle="Home → Contact Us"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-8xl z-10`}
        ilustration={`ilustrationGallery`}
      />
      <div className="py-20 grid grid-cols-3 gap-5 px-10">
        {data.map((item, i) => (
          <Card
            key={i + 1}
            className="bg-gray-50 w-full rounded-lg flex justify-center py-7 px-4"
          >
            <div className="flex flex-col justify-center items-center gap-3">
              <i class={`bi ${item.icon} text-7xl text-sky-800`}></i>
              <Title>{item.title}</Title>
              <div className="w-52">
                <p className="text-center text-sm text-gray-500 font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="py-10 px-5 flex justify-center gap-10">
        <div className="rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.9522000005186!2d112.60430667488363!3d-7.900062992122923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7881c2c4637501%3A0x10433eaf1fb2fb4c!2sHummasoft%20%2F%20Hummatech%20(PT%20Humma%20Teknologi%20Indonesia)!5e0!3m2!1sid!2sid!4v1743950786677!5m2!1sid!2sid"
            width="750"
            height="550"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="flex flex-col gap-5 px-5">
          <Title className="text-4xl font-bold">Ready to Get Started?</Title>
          <p className="text-slate-500 font-light text-sm text-left w-xl">
            Nullam varius, erat quis iaculis dictum, eros urna varius eros, ut
            blandit felis odio in turpis. Quisque rhoncus, eros in auctor
            ultrices,
          </p>
          <form>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="row flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Your Name*
                </label>
                <input
                  type="text"
                  className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div className="row flex flex-col gap-3">
                <label htmlFor="" className="font-medium">
                  Your Email*
                </label>
                <input
                  type="email"
                  className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                  placeholder="Your Email"
                />
              </div>
            </div>
            <div className="row flex flex-col gap-3">
              <label htmlFor="" className="font-medium">
                Write Message*
              </label>
              <textarea
                name=""
                id=""
                className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                placeholder="Write Message*"
                rows={8}
              ></textarea>
            </div>

            <button className="bg-sky-800 rounded text-white text-center font-light py-2 px-4 mt-4">
              Send Message <i class="bi bi-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
