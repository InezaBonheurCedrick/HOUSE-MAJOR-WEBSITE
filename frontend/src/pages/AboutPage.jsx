import React from 'react';
import Team from '../components/Team';
import { ShieldCheckIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';


const awardsData = [
  { icon: <TrophyIcon className="w-8 h-8 text-white" />, title: 'Tech Innovator of the Year', year: '2024' },
  { icon: <StarIcon className="w-8 h-8 text-white" />, title: 'Excellence in AI Development', year: '2023' },
  { icon: <ShieldCheckIcon className="w-8 h-8 text-white" />, title: 'Top Cybersecurity Solution', year: '2023' },
];

const clientLogos = [
  
  '/path/to/client-logo-1.svg',
  '/path/to/client-logo-2.svg',
  '/path/to/client-logo-3.svg',
  '/path/to/client-logo-4.svg',
  '/path/to/client-logo-5.svg',
  '/path/to/client-logo-6.svg',
];

const AboutPage = ({ isDark }) => {
  return (
    <div className={`pt-16 pb-20 px-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        
        <section className="text-center mb-20">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 mt-20`}>Our Story</h1>
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Founded with a vision to bridge the gap between complex problems and intelligent solutions, House Major Ltd has grown into a powerhouse of technological innovation. We are dedicated to empowering businesses and organizations through cutting-edge AI, robust software development, and strategic tech consultancy. Our journey is one of relentless pursuit of excellence and a deep commitment to our clients' success.
          </p>
        </section>

        
        <section className="mb-20">
          <Team isDark={isDark} />
        </section>

        
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Awards & Recognition</h2>
            <p className={`mt-2 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Our commitment to quality and innovation has been recognized by industry leaders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awardsData.map((award) => (
              <div key={award.title} className={`p-4 rounded-lg border ${isDark ? 'bg-[#1a143c] border-transparent' : 'bg-white border-gray-100 shadow-md'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-lg">{award.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{award.title}</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{award.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Trusted by Leading Companies</h2>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full"
          >
            {clientLogos.map((logo, index) => (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <img src={logo} alt={`Client Logo ${index + 1}`} className="max-h-12 w-auto object-contain" />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;