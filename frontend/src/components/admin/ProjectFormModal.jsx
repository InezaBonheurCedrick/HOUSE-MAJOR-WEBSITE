import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import projectService from '../../services/projectService';

const FormInput = ({ label, name, value, onChange, isDark, type = 'text', required = false }) => (
  <div>
    <label 
      htmlFor={name} 
      className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-2 border rounded-md shadow-sm text-sm ${
        isDark 
          ? 'bg-[#1a143c] border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500' 
          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-600 focus:border-indigo-600'
      }`}
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, isDark, rows = 4, helpText = '' }) => (
  <div>
    <label 
      htmlFor={name} 
      className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
    >
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-md shadow-sm text-sm ${
        isDark 
          ? 'bg-[#1a143c] border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500' 
          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-600 focus:border-indigo-600'
      }`}
    />
    {helpText && <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{helpText}</p>}
  </div>
);

const getInitialFormData = () => ({
  title: '',
  description: '',
  category: '',
  date: '',
  fullDescription: '',
  duration: '',
  images: '',
  features: '',
  tags: '',
  team: '',
  clientName: '',
  clientLogo: '',
  clientIndustry: '',
  clientLocation: '',
  liveLink: '',
  githubLink: '',
  iosLink: '',
  androidLink: '',
  results: '[]',
});

const ProjectFormModal = ({ isOpen, onClose, onSave, projectToEdit, isDark}) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const isEditMode = Boolean(projectToEdit);

  // When `projectToEdit` changes, populate the form
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: projectToEdit.title || '',
          description: projectToEdit.description || '',
          category: projectToEdit.category || '',
          date: projectToEdit.date ? new Date(projectToEdit.date).toISOString().split('T')[0] : '', 
          fullDescription: projectToEdit.fullDescription || '',
          duration: projectToEdit.duration || '',
          images: (projectToEdit.images || []).join('\n'),
          features: (projectToEdit.features || []).join('\n'),
          tags: (projectToEdit.tags || []).join('\n'),
          team: (projectToEdit.team || []).join('\n'),
          clientName: projectToEdit.client?.name || '',
          clientLogo: projectToEdit.client?.logo || '',
          clientIndustry: projectToEdit.client?.industry || '',
          clientLocation: projectToEdit.client?.location || '',
          liveLink: projectToEdit.externalLinks?.live || '',
          githubLink: projectToEdit.externalLinks?.github || '',
          iosLink: projectToEdit.downloadLinks?.ios || '',
          androidLink: projectToEdit.downloadLinks?.android || '',
          results: JSON.stringify(projectToEdit.results || [], null, 2),
        });
      } else {
        setFormData(getInitialFormData());
        setSelectedImages([]);
      }
      setError(null);
    }
  }, [projectToEdit, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let parsedResults;
    try {
      parsedResults = JSON.parse(formData.results);
    } catch (err) {
      setError('Invalid JSON format in "Results & Impact" field.', err);
      setLoading(false);
      return;
    }

    // Build FormData for multipart upload
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('date', formData.date);
    if (formData.fullDescription) fd.append('fullDescription', formData.fullDescription);
    if (formData.duration) fd.append('duration', formData.duration);
    // Arrays: send as JSON strings as expected by backend
    fd.append('features', JSON.stringify(formData.features.split('\n').filter(Boolean)));
    fd.append('tags', JSON.stringify(formData.tags.split('\n').filter(Boolean)));
    fd.append('team', JSON.stringify(formData.team.split('\n').filter(Boolean)));
    fd.append('results', JSON.stringify(parsedResults));
    fd.append('externalLinks', JSON.stringify({
      live: formData.liveLink || undefined,
      github: formData.githubLink || undefined,
    }));
    fd.append('downloadLinks', JSON.stringify({
      ios: formData.iosLink || undefined,
      android: formData.androidLink || undefined,
    }));
    fd.append('client', JSON.stringify({
      name: formData.clientName,
      logo: formData.clientLogo,
      industry: formData.clientIndustry,
      location: formData.clientLocation,
    }));
    // Images files
    if (selectedImages && selectedImages.length > 0) {
      selectedImages.forEach((file) => fd.append('images', file));
    }

    try {
      if (isEditMode) {
        await projectService.updateProject(projectToEdit.id, fd);
      } else {
        await projectService.createProject(fd);
      }
      
      onSave();
      
    } catch (err) {
      console.error('Failed to save project:', err);
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  const modalBg = isDark ? 'bg-[#0f0a2e]' : 'bg-white';
  const modalBorder = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className={`relative w-full max-w-3xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col ${modalBg}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${modalBorder}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide ">
          {/* General Information */}
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>General</legend>
            <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Category" name="category" value={formData.category} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Date" name="date" value={formData.date} onChange={handleChange} isDark={isDark} type="date" required />
            <FormInput label="Duration" name="duration" value={formData.duration} onChange={handleChange} isDark={isDark} />
            <FormTextarea label="Short Description" name="description" value={formData.description} onChange={handleChange} isDark={isDark} rows={3} />
            <FormTextarea label="Full Description" name="fullDescription" value={formData.fullDescription} onChange={handleChange} isDark={isDark} rows={5} />
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Content</legend>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Project Images
              </label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImagesChange}
                className={`w-full p-2 border rounded-md shadow-sm text-sm ${
                  isDark 
                    ? 'bg-[#1a143c] border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-600 focus:border-indigo-600'
                }`}
              />
              {isEditMode && !selectedImages.length && (projectToEdit?.images?.length > 0) && (
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Existing images will be kept unless you select new files.
                </p>
              )}
            </div>
            <FormTextarea label="Key Features" name="features" value={formData.features} onChange={handleChange} isDark={isDark} helpText="One feature per line." />
            <FormTextarea label="Technologies (Tags)" name="tags" value={formData.tags} onChange={handleChange} isDark={isDark} helpText="One tag per line." />
            <FormTextarea label="Team Members" name="team" value={formData.team} onChange={handleChange} isDark={isDark} helpText="One name per line." />
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Client</legend>
            <FormInput label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} isDark={isDark} />
            <FormInput label="Client Logo URL" name="clientLogo" value={formData.clientLogo} onChange={handleChange} isDark={isDark} />
            <FormInput label="Client Industry" name="clientIndustry" value={formData.clientIndustry} onChange={handleChange} isDark={isDark} />
            <FormInput label="Client Location" name="clientLocation" value={formData.clientLocation} onChange={handleChange} isDark={isDark} />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Links</legend>
            <FormInput label="Live Site URL" name="liveLink" value={formData.liveLink} onChange={handleChange} isDark={isDark} />
            <FormInput label="GitHub URL" name="githubLink" value={formData.githubLink} onChange={handleChange} isDark={isDark} />
            <FormInput label="iOS App Store URL" name="iosLink" value={formData.iosLink} onChange={handleChange} isDark={isDark} />
            <FormInput label="Android Play Store URL" name="androidLink" value={formData.androidLink} onChange={handleChange} isDark={isDark} />
          </fieldset>

          {/* Results (JSON) */}
          <fieldset>
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Results & Impact</legend>
            <FormTextarea 
              label="Results (JSON Format)" 
              name="results" 
              value={formData.results} 
              onChange={handleChange} 
              isDark={isDark} 
              rows={6}
              helpText={`Must be valid JSON. E.g., [{"metric": "50%", "label": "Increased Sales"}, {"metric": "10k", "label": "New Users"}]`}
            />
          </fieldset>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
              {error}
            </div>
          )}
        </form>

        <div className={`flex items-center justify-end p-5 border-t ${modalBorder} space-x-3`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Project' : 'Save Project')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;