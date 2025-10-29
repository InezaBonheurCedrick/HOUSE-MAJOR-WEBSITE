import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  UserIcon,
  XMarkIcon,
  PhotoIcon,
  MagnifyingGlassIcon, // <-- Added
  EllipsisVerticalIcon, // <-- Added
} from "@heroicons/react/24/outline";
import teamService from "../../services/teamService";
import authService from "../../services/authService";

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 6;

const TeamManagement = ({ isDark }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    linkedin: "",
    github: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // --- 2. State for Search, Pagination, and Actions ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // Stores the ID of the open menu

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  // --- 3. Close action menu when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionMenu && !event.target.closest(".action-menu-container")) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeActionMenu]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamService.getAll();
      setTeamMembers(members);
      setError(null);
    } catch (err) {
      console.error("Error loading team members:", err);
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  // ... (All your modal/form logic remains unchanged) ...
  // --- (handleAddMember, handleEditMember, handleDeleteMember, openEditModal, resetForm, etc.) ---

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setError("Image too large (max 3MB)");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const token = authService.getToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      if (selectedFile) {
        // Upload with image
        const uploadData = new FormData();
        uploadData.append("image", selectedFile);
        uploadData.append("name", formData.name);
        uploadData.append("role", formData.role);
        uploadData.append("bio", formData.bio || "");
        uploadData.append("email", formData.email || "");
        uploadData.append("linkedin", formData.linkedin || "");
        uploadData.append("github", formData.github || "");

        const response = await fetch("http://localhost:5000/team/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }
      } else {
        // Create without image
        await teamService.create(formData, token);
      }

      setShowAddModal(false);
      resetForm();
      loadTeamMembers(); // Reload the list
    } catch (err) {
      console.error("Error adding team member:", err);
      setError("Failed to add team member");
    } finally {
      setUploading(false);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const token = authService.getToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      if (selectedFile) {
        // Update with new image
        const uploadData = new FormData();
        uploadData.append("image", selectedFile);
        uploadData.append("name", formData.name);
        uploadData.append("role", formData.role);
        uploadData.append("bio", formData.bio || "");
        uploadData.append("email", formData.email || "");
        uploadData.append("linkedin", formData.linkedin || "");
        uploadData.append("github", formData.github || "");

        const response = await fetch(
          `http://localhost:5000/team/${editingMember.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: uploadData,
          }
        );

        if (!response.ok) {
          throw new Error("Update failed");
        }
      } else {
        // Update without new image
        await teamService.update(editingMember.id, formData, token);
      }

      setShowEditModal(false);
      setEditingMember(null);
      resetForm();
      loadTeamMembers(); // Reload the list
    } catch (err) {
      console.error("Error updating team member:", err);
      setError("Failed to update team member");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      const token = authService.getToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      await teamService.remove(id, token);
      loadTeamMembers(); // Reload the list
    } catch (err) {
      console.error("Error deleting team member:", err);
      setError("Failed to delete team member");
    }
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      github: member.github || "",
      image: member.image || "",
    }); // Set existing image as preview if available
    if (member.image) {
      setImagePreview(member.image);
    } else {
      setImagePreview(null);
    }
    setSelectedFile(null);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      linkedin: "",
      github: "",
      image: "",
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingMember(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- 4. Filtering and Pagination Logic ---
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teamMembers, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  // --- 5. Action Menu Styles ---
  const actionMenuItemClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark
      ? "text-gray-300 hover:bg-gray-700"
      : "text-gray-700 hover:bg-gray-100"
  }`;
  const actionMenuDeleteClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
  }`;

  const tableHeaderClass = `text-left py-4 px-6 font-medium ${
    isDark ? "text-gray-400" : "text-gray-600"
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- 6. HEADER: Title, Search, and Add Button --- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Team Management
          </h1>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage your team members and roles
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* --- Search Bar --- */}
          <div className="relative flex-1 sm:flex-none">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className={`h-5 w-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </span>
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className={`pl-10 pr-4 py-2 rounded-lg border text-sm w-full sm:w-64 ${
                isDark
                  ? "bg-[#1a143c] border-gray-700 text-white placeholder:text-gray-400 focus:ring-brand focus:border-brand"
                  : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-brand focus:border-brand"
              }`}
            />
          </div>
          {/* --- Responsive Add Button --- */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand hover:bg-brand/90 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 h-10 w-10 sm:w-auto sm:px-4"
            title="Add Member" // Tooltip for icon-only button
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`p-4 rounded-lg ${
            isDark
              ? "bg-red-900/20 border border-red-800"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>
            {error}
          </p>
        </div>
      )}

      {/* --- 7. Team Member Table --- */}
      <div
        className={`rounded-xl border transition-colors duration-300 ${
          isDark
            ? "bg-[#1a143c] border-gray-800"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <th className={tableHeaderClass}>Member</th>
                <th className={tableHeaderClass}>Role</th>
                <th className={tableHeaderClass}>Contact</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={`${tableHeaderClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className={`text-center py-12 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {searchQuery
                        ? "No team members match your search."
                        : "No team members found. Add your first team member!"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member, index) => {
                  const openUp = index > 3; // Open upwards from the 5th row onwards
                  const dropdownPositionClass = openUp
                    ? "bottom-full mb-2"
                    : "mt-2";

                  return (
                    <tr
                      key={member.id}
                      className={`border-b ${
                        isDark
                          ? "border-gray-800 hover:bg-gray-800"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold">
                                {member.name
                                  ? member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <span
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {member.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`py-4 px-6 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {member.role}
                      </td>
                      <td
                        className={`py-4 px-6 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {member.email ? (
                          <div className="flex items-center space-x-2">
                            <EnvelopeIcon
                              className={`h-4 w-4 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <span className="text-sm">{member.email}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No email
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDark
                              ? "bg-green-600 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block text-left action-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(
                                member.id === activeActionMenu
                                  ? null
                                  : member.id
                              );
                            }}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              isDark
                                ? `text-gray-400 hover:text-white ${
                                    activeActionMenu === member.id
                                      ? "bg-gray-700"
                                      : "hover:bg-gray-700"
                                  }`
                                : `text-gray-500 hover:text-gray-900 ${
                                    activeActionMenu === member.id
                                      ? "bg-gray-100"
                                      : "hover:bg-gray-100"
                                  }`
                            }`}
                            title="Actions"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeActionMenu === member.id && (
                            <div
                              className={`absolute w-40 rounded-lg shadow-xl z-20 overflow-hidden right-6 ${dropdownPositionClass} ${
                                isDark
                                  ? "bg-[#1a143c] border border-gray-700"
                                  : "bg-white border border-gray-200"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ul
                                className={`py-1 ${
                                  isDark ? "divide-gray-700" : "divide-gray-200"
                                }`}
                              >
                                <li>
                                  <button
                                    onClick={() => {
                                      openEditModal(member);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuItemClass}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    <span>Edit</span>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleDeleteMember(member.id);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuDeleteClass}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- 8. Pagination Controls --- */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-6 py-3 border-t ${
              isDark
                ? "border-gray-800 bg-[#1a143c]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong>
              <span className="hidden sm:inline ml-4">
                (Total: {filteredMembers.length} members)
              </span>
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                    : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                    : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals (No changes, but wrapped in a cleaner container) --- */}
      {(showAddModal || showEditModal) && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              showAddModal ? setShowAddModal(false) : setShowEditModal(false);
              resetForm();
            }
          }}
        >
          <div
            className={`w-full max-w-lg max-h-[90vh] scrollbar-hide overflow-y-auto rounded-xl ${
              isDark ? "bg-[#1a143c]" : "bg-white"
            } shadow-2xl`}
          >
            {/* Modal Header */}
            <div
            className={`flex justify-between items-center p-5 border-b sticky top-0 ${ // Added sticky top-0 to keep header visible
                isDark
                  ? "border-gray-700 bg-[#1a143c]" // Added bg color to sticky header
                  : "border-gray-200 bg-white" // Added bg color to sticky header
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {showEditModal ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={() => {
                  showAddModal
                    ? setShowAddModal(false)
                    : setShowEditModal(false);
                  resetForm();
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={showEditModal ? handleEditMember : handleAddMember}
              className="space-y-4 p-6"
            >
              {/* --- Form fields --- */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Role *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-[#0f0a2e] border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Profile Image
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(
                            showEditModal ? formData.image || null : null
                          );
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className={`text-sm px-3 py-1 rounded-lg border ${
                          isDark
                            ? "border-red-600 text-red-400 hover:bg-red-900/20"
                            : "border-red-300 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-dashed transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <PhotoIcon className="h-5 w-5" />
                      <span>
                        {imagePreview ? "Change Image" : "Choose Image"}
                      </span>
                    </button>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Max 3MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    showAddModal
                      ? setShowAddModal(false)
                      : setShowEditModal(false);
                    resetForm();
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {showEditModal ? "Updating..." : "Uploading..."}
                      </span>
                    </>
                  ) : showEditModal ? (
                    "Update Member"
                  ) : (
                    "Add Member"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
