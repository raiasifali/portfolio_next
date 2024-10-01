"use client";
import React, { useState } from "react";
import InputField from "@/app/components/tags/InputField";
import TextArea from "@/app/components/tags/TextArea";
import CheckboxField from "@/app/components/tags/CheckboxField";
import ImageUpload from "@/app/components/tags/ImageUpload";
import { ProjectFormData } from "@/app/types/project";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DateInput from "@/app/components/ui/DateInput"; // Import DateInput

// Function to upload images and return their URLs
const uploadImages = async (files: FileList | null): Promise<string[]> => {
  if (!files) return [];

  const storage = getStorage();
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `projects/${file.name}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
};

interface ProjectFormProps {
  initialData?: ProjectFormData;
  onSubmit: (formData: ProjectFormData) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    durationFrom: initialData?.durationFrom || "",
    durationTo: initialData?.durationTo || null,
    isCurrent: initialData?.isCurrent || false,
    link: initialData?.link || "",
    description: initialData?.description || "",
    images: null, // Initialize as null or [] as per your design
  });

  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert FileList to an array of File
      const fileArray = Array.from(files);
      // Keep the URLs for submission, set images to null for now
      setFormData((prev) => ({ ...prev, images: null })); // Keep images null in formData for now

      // Preview images
      const updatedPreviews: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (updatedPreviews.length < 4) {
            updatedPreviews.push(reader.result as string);
          } else {
            updatedPreviews.shift();
            updatedPreviews.push(reader.result as string);
          }
          setUploadedImageUrls(updatedPreviews);
        };
        reader.readAsDataURL(file);
      });

      // After reading, upload images
      uploadImages(files).then((urls) => {
        setFormData((prev) => ({
          ...prev,
          images: urls.length > 0 ? urls : null,
        })); // Set URLs in formData
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...uploadedImageUrls];
    updatedPreviews.splice(index, 1);
    setUploadedImageUrls(updatedPreviews);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [name]: target.checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the updated form data for submission
    const updatedFormData: ProjectFormData = {
      ...formData,
      images: formData.images, // Already set in handleFileChange
    };

    setUploadedImageUrls(updatedFormData.images || []); // Store the uploaded URLs in state
    updatedFormData.images = uploadedImageUrls;
    // Pass the updated form data with URLs to the parent component
    onSubmit(updatedFormData); // Now images is of type string[] | null
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <b className="text-2xl font-bold mb-6 block text-center">
        {initialData ? "Edit Project" : "New Project"}
      </b>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Project Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div className="flex space-x-4">
          <DateInput
            label="Duration From"
            name="durationFrom"
            value={formData.durationFrom}
            onChange={handleChange}
            required
          />
          {!formData.isCurrent && (
            <DateInput
              label="Duration To"
              name="durationTo"
              value={formData.durationTo || ""}
              onChange={handleChange}
            />
          )}
        </div>

        <CheckboxField
          label="Currently Ongoing"
          name="isCurrent"
          checked={formData.isCurrent}
          onChange={handleChange}
        />
        <InputField
          label="Link"
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
        />
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <ImageUpload
          onFileChange={handleFileChange}
          imagePreviews={uploadedImageUrls}
          onRemoveImage={handleRemoveImage}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          {initialData ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
