import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { ProjectFormData } from "@/app/types/project";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export const createProject = async (projectData: any) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), projectData);
    console.log("Project created with ID:", docRef.id);
    return { id: docRef.id, ...projectData }; // Returning project data with the Firestore ID
  } catch (error) {
    console.error("Error creating project", error);
    throw error;
  }
};

export const fetchAllProjects = async (): Promise<ProjectFormData[]> => {
  const projectsCollection = collection(db, "projects");
  const projectsSnapshot = await getDocs(projectsCollection);
  return projectsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as ProjectFormData[];
};

export const fetchProjectById = async (
  id: string
): Promise<ProjectFormData | null> => {
  const projectDoc = doc(db, "projects", id);
  const projectSnapshot = await getDoc(projectDoc);

  if (projectSnapshot.exists()) {
    const projectData = projectSnapshot.data() as Omit<ProjectFormData, "id">; // Fetch data without id
    return { ...projectData, id: projectSnapshot.id }; // Add id once
  } else {
    console.log("No such document!");
    return null; // Return null if the project does not exist
  }
};

export const updateProject = async (
  id: string,
  projectData: Partial<ProjectFormData>
): Promise<void> => {
  const projectRef = doc(db, "projects", id); // Reference to the project document
  await updateDoc(projectRef, { ...projectData }); // Ensure you're passing a plain object to Firestore
};

export const deleteProject = async (projectId: string) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef); // Delete the project document
};
