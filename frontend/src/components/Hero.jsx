import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ isDark }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const heroContent = [
    {
      text: "Leading in AI model building in Rwanda",
      imageUrl:
        "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761584821/Ingram-Micro_Header-image_iStock-2166551077_hhsv8x.jpg", 
    },
    {
      text: "We help businesses thrive using technology",
      imageUrl:
        "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761585591/960x0_awogcq.jpg",
    },
    {
      text: "Secure your business with us",
      imageUrl:
        "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761586895/technology-global-governance-photo-2024_uoxjg8.jpg",
    },
    {
      text: "Thoughts become things",
      imageUrl:
        "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761587342/uYJ_L4bNuO-lnvXUIv9X77vMsMxBk2ShXGxGqp6bpTw_j4o88g.jpg",
    },
    {
      text: "Software development",
      imageUrl:
        "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761585594/Emerging-Technologies-2022_bio5kv.jpg",
    },
  ];

  useEffect(() => {
    heroContent.forEach((item) => {
      const img = new Image();
      img.src = item.imageUrl;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentContentIndex((prev) => (prev + 1) % heroContent.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroContent.length]);

  const handleContactClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "about" } });
    } else {
      const element = document.getElementById("about");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", "/#about");
    }
  };

  const handlePortfolioClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "portfolio" } });
    } else {
      const element = document.getElementById("portfolio");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", "/#portfolio");
    }
  };

  const currentImageUrl = heroContent[currentContentIndex].imageUrl;

  return (
    <section
      id="hero"
      className="relative w-full h-[100vh] min-h-[500px] bg-cover bg-center flex items-center justify-center text-white transition-all duration-500 ease-in-out" // Added transition for background
      style={{ backgroundImage: `url(${currentImageUrl})` }}
    >
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? "bg-black/60" : "bg-black/40"
        }`}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <div className="mb-8">
          <div className="relative h-27 flex items-center justify-center overflow-hidden">
            {" "}
            {heroContent.map((item, index) => (
              <h1
                key={index} 
                className={`absolute inset-x-0 text-2xl md:text-1xl sm:text-3xl lg:text-3xl font-bold transition-all duration-500 ease-in-out transform px-4 ${
                  index === currentContentIndex
                    ? isAnimating
                      ? "opacity-0 -translate-y-5" 
                      : "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{
                  transitionDelay:
                    index === currentContentIndex && !isAnimating
                      ? "0.1s"
                      : "0s",
                }} 
              >
                {item.text}
              </h1>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index === currentContentIndex) return; 
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentContentIndex(index);
                    setIsAnimating(false);
                  }, 500);
                }}
                className={`w-2 h-2 mt-5 rounded-full transition-all duration-300 ${
                  index === currentContentIndex
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleContactClick}
            className="border-2 border-white/60 hover:bg-[#0e2342] hover:border-transparent text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300 cursor-pointer"
          >
            Get Started
          </button>
          <button
            onClick={handlePortfolioClick}
            className="border-2 border-white/60 hover:bg-[#0e2342] hover:border-transparent font-semibold px-8 py-3 rounded-full transition-colors duration-300 cursor-pointer"
          >
            Our Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
