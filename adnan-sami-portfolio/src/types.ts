export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Major' | 'Side Quest';
  tags: string[];
  link?: string;
  image: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'Achievement' | 'Moment' | 'Academic';
}

export interface ProfileInfo {
  name: string;
  bio: string;
  badges: string[];
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

export interface PortfolioData {
  profile: ProfileInfo;
  projects: Project[];
  gallery: GalleryItem[];
}

export interface AnalyticsData {
  views: number;
  loadingSpeed: number; // in ms
  visitorCountries: { country: string; count: number }[];
  viewsByDay: { day: string; count: number }[];
}
