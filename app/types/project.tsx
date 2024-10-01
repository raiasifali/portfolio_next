export interface ProjectFormData {
  id: string;
  title: string;
  durationFrom: string;
  durationTo: string | null;
  isCurrent: boolean;
  link: string;
  description: string;
  images?: string[] | null;
}
