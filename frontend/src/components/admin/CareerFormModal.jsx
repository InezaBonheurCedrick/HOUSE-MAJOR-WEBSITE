import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import careerService from '../../services/careerService';

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
  department: '',
  type: '',
  location: '',
  salary: '',
  experience: '',
  posted: '',
  description: '',
  requirements: '',
  responsibilities: '',
});

const CareerFormModal = ({ isOpen, onClose, onSave, careerToEdit, isDark }) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(careerToEdit);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: careerToEdit.title || '',
          department: careerToEdit.department || '',
          type: careerToEdit.type || '',
          location: careerToEdit.location || '',
          salary: careerToEdit.salary || '',
          experience: careerToEdit.experience || '',
          posted: careerToEdit.posted || '',
          description: careerToEdit.description || '',
          requirements: (careerToEdit.requirements || []).join('\n'),
          responsibilities: (careerToEdit.responsibilities || []).join('\n'),
        });
      } else {
        setFormData(getInitialFormData());
      }
      setError(null);
    }
  }, [careerToEdit, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const careerDto = {
      title: formData.title,
      department: formData.department,
      type: formData.type,
      location: formData.location,
      salary: formData.salary || null,
      experience: formData.experience || null,
      posted: formData.posted || null,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(Boolean),
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
    };

    try {
      if (isEditMode) {
        await careerService.updateCareer(careerToEdit.id, careerDto);
      } else {
        await careerService.createCareer(careerDto);
      }
      
      onSave();
      
    } catch (err) {
      console.error('Failed to save career:', err);
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
        <div className={`flex items-center justify-between p-5 border-b ${modalBorder}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isEditMode ? 'Edit Job Opening' : 'Add New Job Opening'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Job Details</legend>
            <FormInput label="Job Title" name="title" value={formData.title} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Job Type" name="type" value={formData.type} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Location" name="location" value={formData.location} onChange={handleChange} isDark={isDark} required />
            <FormInput label="Salary" name="salary" value={formData.salary} onChange={handleChange} isDark={isDark} />
            <FormInput label="Experience Required" name="experience" value={formData.experience} onChange={handleChange} isDark={isDark} />
            <FormInput label="Posted Date" name="posted" value={formData.posted} onChange={handleChange} isDark={isDark} type="date" />
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</legend>
            <FormTextarea label="Job Description" name="description" value={formData.description} onChange={handleChange} isDark={isDark} rows={5} required />
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Requirements & Responsibilities</legend>
            <FormTextarea label="Requirements" name="requirements" value={formData.requirements} onChange={handleChange} isDark={isDark} helpText="One requirement per line." />
            <FormTextarea label="Responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} isDark={isDark} helpText="One responsibility per line." />
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
            {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Job' : 'Save Job')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerFormModal;
