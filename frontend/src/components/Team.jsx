import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { EnvelopeIcon, LinkedinIcon, GithubIcon } from "./icons";

const TeamMemberCard = ({ member, isDark }) => (
  <div
    className={`flex flex-col rounded-xl transition-all duration-300 border border-transparent hover:-translate-y-1 group ${
      isDark
        ? "bg-[#1a143c] shadow-lg hover:shadow-xl hover:border-indigo-500/30"
        : "bg-white shadow-md border-gray-100 hover:shadow-lg"
    }`}
  >
    <div className="relative w-full h-45 overflow-hidden rounded-t-xl">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-4 flex-grow flex flex-col items-center text-center">
      <h3
        className={`text-lg font-bold mb-1 transition-colors duration-300 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {member.name}
      </h3>
      <p
        className={`text-sm mb-3 transition-colors duration-300 ${
          isDark ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        {member.role}
      </p>
      <p
        className={`text-xs mb-4 transition-colors duration-300 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {member.bio}
      </p>
      <div className="flex gap-2 mt-auto">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className={`p-2 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
              isDark
                ? "bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white shadow-sm hover:shadow-md"
                : "bg-gray-100 hover:bg-indigo-600 text-gray-700 hover:text-white shadow-xs hover:shadow-sm"
            }`}
            aria-label="Email"
          >
            <EnvelopeIcon className="h-4 w-4" />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
              isDark
                ? "bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white shadow-sm hover:shadow-md"
                : "bg-gray-100 hover:bg-indigo-600 text-gray-700 hover:text-white shadow-xs hover:shadow-sm"
            }`}
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        )}
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 ${
              isDark
                ? "bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white shadow-sm hover:shadow-md"
                : "bg-gray-100 hover:bg-indigo-600 text-gray-700 hover:text-white shadow-xs hover:shadow-sm"
            }`}
            aria-label="GitHub"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </div>
);

const Team = ({ isDark }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get("https://house-major-website.onrender.com/team");
        setTeamMembers(res.data);
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Failed to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section
      className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? "bg-[#0a0424]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-center mb-12">
          <h3
            className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Our Team
          </h3>
          <p
            className={`text-base max-w-2xl mx-auto transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Our dedicated team works tirelessly to ensure our continued success
            and innovation.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading team members...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : teamMembers.length === 0 ? (
          <p className="text-gray-400">No team members found.</p>
        ) : (
          <>
            <div className="pt-4">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-team",
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                speed={600}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-12"
              >
                {teamMembers.map((member) => (
                  <SwiperSlide key={member.id}>
                    <TeamMemberCard member={member} isDark={isDark} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="swiper-pagination-team text-center"></div>
          </>
        )}
      </div>
    </section>
  );
};

export default Team;
