"use client";
import React, { useEffect, useState } from "react";
import ProjectForm from "../../shared/ProjectForm";
import { ProjectFormData } from "@/app/types/project";
import { fetchProjectById, updateProject } from "@/app/services/projectAPI";
import { showToast } from "@/app/components/ui/toast";
import { useRouter } from "next/navigation";

const EditProject: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null); // State to hold the project ID

  useEffect(() => {
    // Get the project ID from the URL using window.location
    const id = window.location.pathname.split("/").pop(); // Assuming the URL is like /projects/edit/1
    if (id) {
      setProjectId(id);
      loadProject(id); // Load the project after setting the ID
    }
  }, []);

  const loadProject = async (id: string) => {
    const projectData = await fetchProjectById(id);
    setFormData(projectData);
  };

  const handleUpdateProject = async (updatedData: ProjectFormData) => {
    if (projectId) {
      await updateProject(projectId, updatedData);
      showToast("Project updated successfully!", "success");
      router.push("/projects");
    }
  };

  return (
    <div>
      <h1>Edit Project</h1>
      {formData ? (
        <ProjectForm onSubmit={handleUpdateProject} initialData={formData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditProject;
