export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tokens: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
}
