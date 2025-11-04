import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = ({ isDark }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // ... (useEffect for fetching project, nextImage, prevImage, openGallery, handleBack remain the same) ...

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://house-major-website-qgs3.onrender.com/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const nextImage = useCallback(() => {
    if (project?.images) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [project?.images]);

  const prevImage = useCallback(() => {
    if (project?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  }, [project?.images]);

  useEffect(() => {
    if (project?.images && project.images.length > 1) {
      const timer = setInterval(() => {
        if (!isGalleryHovered) {
          nextImage();
        }
      }, 2000); 
      
      return () => clearInterval(timer);
    }
  }, [isGalleryHovered, nextImage, project?.images]);


  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleBack = () => {
    navigate(-1);
  };


  if (loading) {
     return (
       <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0424] text-white' : 'bg-gray-50 text-gray-900'}`}>
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
           <p>Loading project details...</p>
         </div>
       </div>
     );
  }

  if (error || !project) {
     return (
       <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0424] text-white' : 'bg-gray-50 text-gray-900'}`}>
         <div className="text-center">
           <h2 className="text-2xl font-bold mb-4">{error || 'Project Not Found'}</h2>
           <button onClick={handleBack} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg">
             Go Back to Portfolio
           </button>
         </div>
       </div>
     );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0a0424] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Back Button Bar */}
      <div className={`border-b transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <button onClick={handleBack} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`} aria-label="Go back">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Portfolio</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Project Header Info */}
        <div className="mb-12">
          {/* ... (Category, Date, Title, Description - no changes needed here) ... */}
           <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
              isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {project.category}
            </span>
            <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <CalendarIcon className="h-4 w-4" />
              <span>{project.date}</span>
            </div>
          </div>
          
          <h1 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {project.title}
          </h1>
          
          <p className={`text-base leading-relaxed max-w-4xl transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {project.description}
          </p>
        </div>

        {/* --- IMAGE GALLERY --- */}
        {project.images && project.images.length > 0 && (
          // --- 1. ADD max-w-* and mx-auto TO CONSTRAIN AND CENTER ---
          <div 
            className="mb-12 max-w-4xl mx-auto" // Adjust max-w-4xl as needed (e.g., max-w-5xl)
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            
            <div className="relative mb-2 group rounded-lg overflow-hidden">
               {/* --- 2. REPLACE FIXED HEIGHT WITH ASPECT RATIO --- */}
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} gallery ${currentImageIndex + 1}`}
                className={`w-full aspect-video object-cover transition-all duration-300 cursor-pointer ${ // Changed h-[...] to aspect-video
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                onClick={() => openGallery(currentImageIndex)}
              />
              <div 
                className="absolute inset-0 group-hover:bg-black/20 transition-all duration-300"
                onClick={() => openGallery(currentImageIndex)}
                aria-hidden="true"
              />

              {/* Prev/Next Buttons (No changes needed) */}
              {project.images.length > 1 && (
                <button onClick={prevImage} className="absolute top-1/2 left-3 md:left-4 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer" aria-label="Previous image">
                  <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              )}
              {project.images.length > 1 && (
                <button onClick={nextImage} className="absolute top-1/2 right-3 md:right-4 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer" aria-label="Next image">
                  <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              )}
            </div>

            {/* Thumbnails (No changes needed, will wrap within the max-width) */}
            {project.images.length > 1 && (
              <div className="flex overflow-x-auto space-x-2 p-2 scrollbar-hide"> {/* Added scrollbar-hide */}
                {project.images.map((image, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 ${ index === currentImageIndex ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent hover:ring-2 hover:ring-indigo-300 opacity-70 hover:opacity-100' }`} aria-label={`View image ${index + 1}`}>
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-16 w-24 object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* --- END IMAGE GALLERY --- */}


        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Overview, Features, Results) */}
          <div className="lg:col-span-2 space-y-12">
             {/* ... (Sections remain the same) ... */}
              <section>
              <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Project Overview
              </h2>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {project.fullDescription || project.description}
              </p>
            </section>

            {project.features && project.features.length > 0 && (
              <section>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg transition-colors duration-300 ${
                        isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
                      }`}
                    >
                      <CheckCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.results && project.results.length > 0 && (
              <section>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Results & Impact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center transition-colors duration-300 ${
                        isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
                      }`}
                    >
                      <p className="text-2xl font-bold text-indigo-500 mb-1">
                        {result.metric}
                      </p>
                      <p className={`text-xs transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {result.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Area (Client, Details, Tags, Links) */}
          <div className="space-y-6">
            {/* ... (Sidebar sections remain the same) ... */}
               {project.client && (
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Client Information
                </h3>
                {project.client.logo && (
                  <div className="mb-4">
                    <img
                      src={project.client.logo}
                      alt={project.client.name}
                      className="h-12 mb-3"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Company
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {project.client.name}
                    </p>
                  </div>
                  {project.client.industry && (
                    <div>
                      <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Industry
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.client.industry}
                      </p>
                    </div>
                  )}
                  {project.client.location && (
                    <div>
                      <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Location
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.client.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`p-6 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Project Details
              </h3>
              <div className="space-y-3">
                {project.duration && (
                  <div>
                    <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Duration
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {project.duration}
                    </p>
                  </div>
                )}
                {project.team && project.team.length > 0 && (
                  <div>
                    <p className={`text-xs font-semibold mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Team
                    </p>
                    <div className="flex items-start gap-2">
                      <UserGroupIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        {project.team.map((member, index) => (
                          <p
                            key={index}
                            className={`text-sm transition-colors duration-300 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {member}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                        isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.externalLinks && (
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  External Links
                </h3>
                <div className="space-y-3">
                  {project.externalLinks.live && (
                    <a
                      href={project.externalLinks.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        isDark 
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <GlobeAltIcon className="h-5 w-5 text-indigo-500" />
                      <span className="flex-1 text-sm">Visit Live Site</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  )}
                  {project.externalLinks.github && (
                    <a
                      href={project.externalLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        isDark 
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <TagIcon className="h-5 w-5 text-indigo-500" />
                      <span className="flex-1 text-sm">View on GitHub</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {project.downloadLinks && (project.downloadLinks.ios || project.downloadLinks.android) && (
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-[#1a143c]' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Download App
                </h3>
                <div className="space-y-3">
                  {project.downloadLinks.ios && (
                    <a
                      href={project.downloadLinks.ios}
                      className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 text-sm"
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5" />
                      <span>Download for iOS</span>
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </a>
                  )}
                  {project.downloadLinks.android && (
                    <a
                      href={project.downloadLinks.android}
                      className={`flex items-center justify-center gap-2 w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-30s-center-300 text-sm ${
                        isDark 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5" />
                      <span>Download for Android</span>
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && project.images && (
        <div className="fixed inset-0 z-[60] backdrop-blur-md bg-black/80 flex items-center justify-center p-4"> {/* Increased z-index */}
          {/* Close Button */}
          <button onClick={() => setIsGalleryOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white z-10 cursor-pointer" aria-label="Close gallery">
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          {/* Prev Button */}
          {project.images.length > 1 && (
            <button onClick={prevImage} className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer" aria-label="Previous image">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}

          {/* Image Container */}
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <img
              src={project.images[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain mx-auto block" // Centered image
            />
             {project.images.length > 1 && (
                <p className="text-white/80 text-center mt-3 text-sm absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-black/30 px-2 py-0.5 rounded"> {/* Positioned counter below image */}
                    {currentImageIndex + 1} / {project.images.length}
                </p>
             )}
          </div>

          {/* Next Button */}
           {project.images.length > 1 && (
            <button onClick={nextImage} className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer" aria-label="Next image">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
           )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;