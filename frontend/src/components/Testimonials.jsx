import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay } from 'swiper/modules';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const TestimonialCard = ({ testimonial, isDark }) => (
  <div
    className={`h-full flex flex-col p-6 rounded-xl transition-all duration-300 border border-transparent hover:-translate-y-1 group ${
      isDark
        ? 'bg-[#1a143c] shadow-lg hover:shadow-xl'
        : 'bg-white shadow-md border-gray-100 hover:shadow-lg'
    }`}
  >
    <div className="flex items-center mb-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-indigo-400 transition-all duration-300 group-hover:border-indigo-500"
      />
      <div>
        <h4
          className={`text-lg font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {testimonial.name}
        </h4>
        <p
          className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {testimonial.role}
        </p>
      </div>
    </div>

    <div className="relative flex-grow mb-4">
      <span
        className={`absolute top-0 right-0 text-6xl font-bold opacity-10 transition-colors duration-300 ${
          isDark ? 'text-indigo-400' : 'text-gray-300'
        }`}
      >
        "
      </span>
      <p
        className={`italic text-sm leading-relaxed transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {testimonial.quote}
      </p>
    </div>

    <div
      className={`pt-4 flex justify-between items-center transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } border-t`}
    >
      <div className="flex items-center">
        <img
          src={testimonial.companyLogo}
          alt={testimonial.company}
          className="h-5 mr-2 transition-all duration-300 group-hover:scale-110"
        />
        <span
          className={`font-semibold text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {testimonial.company}
        </span>
      </div>
      <div className="flex items-center text-green-500 transition-all duration-300 group-hover:scale-110">
        <CheckBadgeIcon className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Verified</span>
      </div>
    </div>
  </div>
);

const Testimonials = ({ isDark }) => {
  const testimonials = [
    {
      name: 'Alice Niyonsenga',
      role: 'Program Manager, IUCN Rwanda',
      quote:
        'HOUSE MAJOR’s geospatial data system helped us monitor environmental projects with real-time accuracy. Their technical team was incredibly responsive and professional throughout the deployment.',
      company: 'IUCN Rwanda',
      companyLogo:
        'https://placehold.co/100x40/1a143c/ffffff?text=IUCN&font=roboto',
      avatar: 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761906690/International-Union-for-Conservation-of-Nature-IUCN-Rwanda-is-hiring-a-Program-Officer_zi05a4.png',
    },
    {
      name: 'Eric Mugabo',
      role: 'CTO, WelTel Rwanda',
      quote:
        'The team at HOUSE MAJOR developed and integrated an AI-driven analytics module into our health platform, significantly improving our operational efficiency and decision-making.',
      company: 'WelTel Rwanda',
      companyLogo:
        'https://placehold.co/100x40/1a143c/ffffff?text=WelTel&font=roboto',
      avatar: 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761906690/logo_2024182096_vytnsg.png',
    },
    {
      name: 'Sandrine Uwase',
      role: 'IT Specialist, Rwanda Biomedical Centre',
      quote:
        'HOUSE MAJOR built a secure data system that streamlined our internal reporting and improved data protection standards across departments. Their work exceeded our expectations.',
      company: 'RBC',
      companyLogo:
        'https://placehold.co/100x40/1a143c/ffffff?text=RBC&font=roboto',
      avatar: 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761906691/RBC-LOGO_Sept30_2019-Regular_yychpo.png',
    },
    {
      name: 'Jean Claude Habimana',
      role: 'Digital Projects Lead, EDCL Rwanda',
      quote:
        'Partnering with HOUSE MAJOR transformed how we manage energy distribution data. Their DevOps and automation expertise reduced our downtime and improved transparency.',
      company: 'EDCL',
      companyLogo:
        'https://placehold.co/100x40/1a143c/ffffff?text=EDCL&font=roboto',
      avatar: 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761906690/EDCL_hlnvci.jpg',
    },
    {
      name: 'Grace Mukamana',
      role: 'Director, AESG Africa',
      quote:
        'We were impressed by HOUSE MAJOR’s professionalism and deep understanding of AI systems. They delivered an intuitive dashboard that’s now a core part of our workflow.',
      company: 'HealthData Analytics',
      companyLogo:
        'https://placehold.co/100x40/1a143c/ffffff?text=HealthData&font=roboto',
      avatar: 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761906691/logo_africaesg_fbnstb.png',
    },
  ];

  return (
    <section
      className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? 'bg-[#0a0424]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          What Our Partners Say
        </h2>
        <p
          className={`text-base max-w-2xl mx-auto mb-12 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Organizations across Africa trust HOUSE MAJOR to deliver scalable,
          secure, and innovative digital solutions that create real impact.
        </p>

        <div className="py-4">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom',
              bulletClass: `swiper-pagination-bullet transition-all duration-300 ${
                isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`,
              bulletActiveClass: `swiper-pagination-bullet-active transition-all duration-300 ${
                isDark ? 'bg-indigo-500' : 'bg-indigo-600'
              }`,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              waitForTransition: true,
            }}
            speed={600}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <TestimonialCard testimonial={testimonial} isDark={isDark} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-pagination-custom text-center"></div>
      </div>
    </section>
  );
};

export default Testimonials;
