import React from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const ApplicationDetailsModal = ({ isOpen, onClose, application, isDark }) => {
  if (!isOpen || !application) return null;

  const modalBg = isDark ? "bg-[#0f0a2e]" : "bg-white";
  const modalBorder = isDark ? "border-gray-700" : "border-gray-200";

  const resumeUrl = application.resumeUrl || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col ${modalBg}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${modalBorder}`}>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Application Details
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full cursor-pointer ${
              isDark
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Applicant Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Full Name"
                value={application.fullName}
                isDark={isDark}
              />
              <InfoItem
                icon={<EnvelopeIcon className="h-5 w-5" />}
                label="Email"
                value={application.email}
                isDark={isDark}
              />
              {application.phone && (
                <InfoItem
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Phone"
                  value={application.phone}
                  isDark={isDark}
                />
              )}
              <InfoItem
                icon={<CalendarIcon className="h-5 w-5" />}
                label="Applied Date"
                value={new Date(application.createdAt).toLocaleDateString()}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Job Info */}
          <Section title="Job Information" isDark={isDark}>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Position Applied For
            </p>
            <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
              {application.jobTitle || "General Application"}
            </p>
          </Section>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Section title="Cover Letter" isDark={isDark}>
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {application.coverLetter}
              </p>
            </Section>
          )}

          {/* Resume / CV Section */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Resume / CV
            </h3>

            {resumeUrl ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? "bg-gray-800/30 border-gray-700 text-gray-300"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
                    <div>
                      <p className="font-medium">Resume Available</p>
                      <p className="text-sm">
                        Click the button below to view the applicant's resume/CV in a new tab.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.open(resumeUrl, "_blank")}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 cursor-pointer ${
                      isDark
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-brand hover:bg-brand-700 text-white"
                    }`}
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    <span>Open CV</span>
                  </button>

                  <a
                    href={resumeUrl}
                    download
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>Download CV</span>
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resumeUrl);
                      alert("Resume URL copied to clipboard!");
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 cursor-pointer ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    <span>Copy URL</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700 text-gray-300"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium">No Resume Attached</p>
                    <p className="text-sm">
                      This applicant did not submit a resume with their application.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end p-6 border-t ${modalBorder}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InfoItem = ({ icon, label, value, isDark }) => (
  <div className="flex items-center space-x-3">
    <div className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>{icon}</div>
    <div>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  </div>
);

const Section = ({ title, children, isDark }) => (
  <div className="space-y-4">
    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h3>
    <div
      className={`p-4 rounded-lg border ${
        isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      {children}
    </div>
  </div>
);

export default ApplicationDetailsModal;