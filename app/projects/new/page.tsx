"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import ProjectForm from "../shared/ProjectForm";
import { ProjectFormData } from "@/app/types/project";
import { createProject } from "@/app/services/projectAPI";
import { showToast } from "@/app/components/ui/toast";

const NewProject: React.FC = () => {
  const router = useRouter(); // Initialize useRouter

  const handleCreateProject = async (formData: ProjectFormData) => {
    console.log("Creating new project...", formData);
    const response = await createProject(formData);

    if (response) {
      showToast("Project created successfully!", "success");
      router.push("/projects"); // Redirect to projects path
    } else {
      showToast("Failed to create project.", "error");
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <ProjectForm onSubmit={handleCreateProject} />
    </div>
  );
};

export default NewProject;
