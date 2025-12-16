import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroPage = () => {
  const slides = [
    {
      id: 1,
      title: "Manage Your Assets Effortlessly",
      subtitle: "Track, assign, and return assets with ease",
      img: "https://via.placeholder.com/1600x600?text=Slide+1",
    },
    {
      id: 2,
      title: "Boost Employee Productivity",
      subtitle: "Keep your workforce equipped and accountable",
      img: "https://via.placeholder.com/1600x600?text=Slide+2",
    },
    {
      id: 3,
      title: "Smart Asset Management",
      subtitle: "Visualize and control company resources seamlessly",
      img: "https://via.placeholder.com/1600x600?text=Slide+3",
    },
  ];

  return (
    <div className="w-full h-[600px] md:h-[500px] relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="w-full h-full bg-cover bg-center flex flex-col justify-center items-center text-center relative"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {slide.subtitle}
              </motion.p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroPage;
