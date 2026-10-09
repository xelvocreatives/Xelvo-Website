export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  isFeatured: boolean;
  createdAt: string; // Supabase returns ISO string
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  text: string;
  socialPlatform: string | null;
  socialLink: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface Application {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  position: string;
  experience: string;
  locationType: "remote" | "onsite";
  locationDetail: string | null;
  resumeUrl: string;
  bio: string;
  motivation: string;
  status: "new" | "reviewing" | "contacted" | "rejected" | "hired";
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}
