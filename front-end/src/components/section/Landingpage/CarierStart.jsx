import Badge from "../../Badge";

const CarierStart = () => {
  return (
    <section className="w-full bg-white relative py-14 px-10">
      <div className="absolute right-0 -top-19 z-50">
        <img src="assets/icons/dot_shape_4.png" alt="" />
      </div>
      <div className="flex justify-between gap-5 items-center">
        <div className="">
          <img src="assets/img/vector_3.png" alt="vector_3.png" className="w-2xl"/>
        </div>
        <div className="flex flex-col gap-5 w-2xl">
          <div>
          <Badge>Why Choose Us</Badge>
          </div>
          <h1 className="text-slate-800 font-semibold text-3xl">
            Let’s Get Started Your Carrer With Edura Education
          </h1>
          <p className="text-slate-500 text-sm text-left">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantsnium dolore mque laudantium, totam rem aperiam, eaque ipsa
            quae illo inventore veritatis et quasi architecto beatae vitae dicta
            unde omnis iste natus error sit
          </p>
          <button className="border border-blue-500 rounded bg-white text-blue-500 text-sm w-1/3 py-1.5 px-4 hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer hover:text-blue-800">Watch How To Start <i className="bi bi-caret-right text-lg"></i></button>
        </div>
      </div>
    </section>
  );
};

export default CarierStart;
