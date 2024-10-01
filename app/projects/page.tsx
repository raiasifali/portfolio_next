"use client";
import React, { useEffect, useState } from "react";
import { fetchAllProjects, deleteProject } from "@/app/services/projectAPI";
import { ProjectFormData } from "@/app/types/project";
import Link from "next/link";
import ConfirmationModal from "./shared/confirmationModal";
import { showToast } from "../components/ui/toast";

const ProjectsTable: React.FC = () => {
  const [projects, setProjects] = useState<ProjectFormData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectsData = await fetchAllProjects();
        setProjects(projectsData);
      } catch (error) {
        showToast("Error fetching projects", "error"); // Show error toast
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    getProjects();
  }, []);

  const handleDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete);
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectToDelete)
        );
        showToast("Project deleted successfully!", "success"); // Show success toast
      } catch (error) {
        showToast("Error deleting project", "error"); // Show error toast
      } finally {
        setProjectToDelete(null);
        setIsModalOpen(false);
      }
    }
  };

  const openModal = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Projects List</h1>
      <Link href="/projects/new">
        <button className="mb-4 bg-green-600 text-white py-2 px-4 rounded">
          New Project
        </button>
      </Link>

      {loading ? (
        <div className="text-center">Loading projects...</div>
      ) : (
        <div className="max-w-full">
          <table className="min-w-full max-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Duration From
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Duration To
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Is Current
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Images
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Edit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-1/4">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate w-1/4">
                    {project.title}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate w-1/4">
                    {project.durationFrom}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate w-1/4">
                    {project.durationTo ? project.durationTo : "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate w-1/4">
                    {project.isCurrent ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex flex-wrap space-x-2">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt="Project Image"
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <span>No Images</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/projects/edit/${project.id}`}>
                      <span className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-500">
                        Edit
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(project.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this project?"
      />
    </div>
  );
};

export default ProjectsTable;
