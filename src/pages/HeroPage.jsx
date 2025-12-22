import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";

// IMPORT THESE CORE CSS FILES
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroPage = () => {
  const slides = [
    {
      id: 1,
      title: "Manage Your Assets Effortlessly",
      subtitle: "Track, assign, and return company assets with ease",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426", 
    },
    {
      id: 2,
      title: "Empower Your Team",
      subtitle: "Keep employees equipped and accountable",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2670",
    },
    {
      id: 3,
      title: "Smart Analytics & Insights",
      subtitle: "Make data-driven decisions for asset allocation",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670",
    },
  ];

  return (
    <section className="w-full h-[500px] md:h-[600px] lg:h-[80vh]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="mySwiper h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image using <img> tag for better compatibility */}
              <img 
                src={slide.img} 
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-8 md:px-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight max-w-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-all">
                      Get Started
                    </button>
                    <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-md font-semibold transition-all">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Swiper Arrows (Add this to your global CSS if needed) */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(0,0,0,0.3);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          transform: scale(0.7);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
        }
        .swiper-pagination-bullet-active {
          background: #2563eb !important;
        }
      `}</style>
    </section>
  );
};

export default HeroPage;