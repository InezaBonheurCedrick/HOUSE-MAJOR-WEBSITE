import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectCard = ({ project, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDownloadable = project.downloadLinks?.ios || project.downloadLinks?.android;
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 border ${
        isDark ? "bg-[#1a143c] border-transparent" : "bg-white border-gray-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={project.images?.[0]}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered ? "blur-sm scale-105" : ""
          }`}
        />
{isHovered && (
  <div
    className="absolute inset-0 flex items-center justify-center space-x-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
  >
    <button
      onClick={handleViewProject}
      className={`p-3 backdrop-filter backdrop-blur-sm rounded-full transition-colors duration-300 cursor-pointer 
        ${isDark
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-gray-800/20 text-white hover:bg-gray-800/30"
        }`}
      aria-label="View Project"
    >
      <EyeIcon className="h-5 w-5" />
    </button>

    {project.externalLinks?.live && (
      <a
        href={project.externalLinks.live}
        target="_blank"
        rel="noopener noreferrer"
        className={`p-3 backdrop-filter backdrop-blur-sm rounded-full transition-colors duration-300 cursor-pointer 
          ${isDark
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-gray-800/20 text-white hover:bg-gray-800/30"
          }`}
        aria-label="Open Link"
      >
        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
      </a>
    )}
  </div>
)}

      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isDark ? "bg-brand text-white" : "bg-brand/10 text-brand"
            }`}
          >
            {project.category}
          </span>
        </div>
        <h3
          className={`text-lg font-bold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {project.description}
        </p>

        {isDownloadable && (
          <div className="flex justify-end">
            <a
              href={project.downloadLinks.ios || project.downloadLinks.android}
              className={`flex items-center gap-2 px-3 py-2 rounded-full font-semibold transition-colors duration-300 text-sm ${
                isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Portfolio = ({ isDark }) => {
  const [filter, setFilter] = useState("All Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const categories = [
    "All Projects",
    "Software development",
    "Data security",
    "Tech consultancy",
    "Ai model development",
    "DevOps",
    "Cybersecurity",
    "Geospatial analysis",
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://house-major-website.onrender.com/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);


  useEffect(() => {
    setShowAll(false);
  }, [filter]);

  const filteredProjects =
    filter === "All Projects"
      ? projects
      : projects.filter((p) => p.category === filter);

  const displayedProjects = showAll 
    ? filteredProjects 
    : filteredProjects.slice(0, 3);

  const hasMoreProjects = filteredProjects.length > 3;

  if (loading) {
    return (
      <section
        className={`py-16 text-center ${
          isDark ? "bg-[#0a0424] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <p>Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`py-16 text-center ${
          isDark ? "bg-[#0a0424] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section  id="portfolio"
      className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? "bg-[#0a0424]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className={`text-3xl font-bold mb-4 mt-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Portfolio
        </h2>
        <p
          className={`text-base mb-8 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore our diverse portfolio of successful projects across various
          domains and technologies
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 border text-sm cursor-pointer ${
                filter === cat
                  ? "btn-brand text-white shadow-md border-brand"
                  : isDark
                  ? "bg-[#1a143c] text-gray-300 hover:bg-brand hover:text-white border-transparent"
                  : "bg-white text-gray-600 hover:bg-[#0e2342] hover:text-white border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isDark={isDark} />
            ))
          ) : (
            <p
              className={`col-span-full text-center ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No projects found in this category.
            </p>
          )}
        </div>

        {hasMoreProjects && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 border cursor-pointer btn-brand hover:bg-brand/90 text-white border-brand`}
          >
            View More Projects
          </button>
        )}

        
        {showAll && hasMoreProjects && (
          <button
            onClick={() => setShowAll(false)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 border cursor-pointer ${
              isDark
                ? "bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
                : "bg-gray-500 hover:bg-gray-600 text-white border-gray-500"
            }`}
          >
            Show Less
          </button>
        )}
      </div>
    </section>
  );
};

export default Portfolio;