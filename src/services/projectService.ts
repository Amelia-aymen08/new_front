const API_URL = "http://localhost:5000/api";

export type ProjectData = {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: string; // 'current' or 'delivered'
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  features: string[];
  deliveryDate: string;
  localityId: number;
  coverImage: string;
  images: string[];
  locality?: {
      id: number;
      name: string;
  }
};

export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const fetchProjectById = async (id: number): Promise<ProjectData | null> => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  };
