import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://imagenes.primicias.ec/files/main_image_832_468/uploads/2025/06/02/683db9b58a92d.jpeg",
    title: "Excelencia Académica",
    subtitle: "Formando líderes con valores sólidos y visión global.",
  },
  {
    image:
      "https://www.colegioceuvalencia.es/wp-content/uploads/Como-ayudar-a-tu-hijo-a-adaptarse-mejor-en-su-nuevo-colegio-820x500.jpg",
    title: "Tecnología y Aprendizaje",
    subtitle: "Entornos modernos con herramientas digitales avanzadas.",
  },
  {
    image:
      "https://fundacionbotin.org/wp-content/uploads/2023/06/propuestas-colegios-1024x683.jpg",
    title: "Educación Integral",
    subtitle: "Programas STEAM, liderazgo y desarrollo humano.",
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 mb-2"> {/* ← Espaciado ajustado: 1.5rem arriba, 0.5rem abajo */}
      <div className="relative w-full max-w-6xl mx-auto h-[420px] md:h-[480px] overflow-hidden rounded-3xl shadow-xl border border-slate-800/40 bg-slate-900">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === current 
                  ? "opacity-100 z-10" 
                  : "opacity-0 z-[-1] pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                className="w-full h-full object-cover"
                alt={slide.title}
              />

              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-3xl md:text-5xl text-white font-bold drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-white text-lg md:text-xl mt-2 max-w-2xl drop-shadow">
                  {slide.subtitle}
                </p>

                <button className="mt-6 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-full text-sm md:text-base shadow-md transition">
                  Leer más
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white shadow z-20"
          onClick={prev}
          type="button"
        >
          <ChevronLeft size={24} className="text-brand-700" />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white shadow z-20"
          onClick={next}
          type="button"
        >
          <ChevronRight size={24} className="text-brand-700" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === current
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};