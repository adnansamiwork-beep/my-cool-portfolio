import { PortfolioData, AnalyticsData } from './types';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Adnan Sami",
    bio: "Cruising at the intersection of Legal Advocacy, Business Strategy, and Communication Excellence. Transforming analytical complexity into commercial value.",
    badges: ["Law Student", "Businessman", "IELTS 7.0 Certified"],
    email: "adnansamiwork@gmail.com",
    phone: "+880 1700-000000",
    location: "Dhaka, Bangladesh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256",
  },
  projects: [
    {
      id: "proj-1",
      title: "LexSmart: AI Contract Compliance Audit",
      description: "A framework designed to analyze corporate contract clauses and flag regulatory risks automatically. Spearheaded legal analysis and project specifications.",
      category: "Major",
      tags: ["Contract Law", "Legal Tech", "Compliance"],
      link: "https://example.com/lexsmart",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600&h=400",
      date: "2026-03"
    },
    {
      id: "proj-2",
      title: "Sami Logistics & Distribution Venture",
      description: "Co-founded and scaled an urban regional distribution enterprise, optimization hub supply chains, servicing over 50 B2B standard retail nodes.",
      category: "Major",
      tags: ["Business Operations", "Supply Chain", "SME Growth"],
      link: "https://example.com/sami-logistics",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600&h=400",
      date: "2025-11"
    },
    {
      id: "proj-3",
      title: "International Commercial Moot Court Simulation",
      description: "Represented our school in drafting comprehensive legal memorials concerning bilateral investment treaty breaches and intellectual property rights violations.",
      category: "Major",
      tags: ["Moot Court", "IP Law", "Arbitration"],
      image: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=600&h=400",
      date: "2026-02"
    },
    {
      id: "quest-1",
      title: "The Savvy Legal Brief: Law Blog",
      description: "Amassed legal analysis briefs simplifying complex supreme court verdicts for everyday citizens and business operators.",
      category: "Side Quest",
      tags: ["Civil Law", "Writing", "Public Education"],
      link: "https://example.com/blog",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400",
      date: "2026-01"
    },
    {
      id: "quest-2",
      title: "Global Commerce & IELTS Prep Hub",
      description: "A digital resource space curating templates and structural writing models that helped me achieve an overall Band 7.0 score in first attempt.",
      category: "Side Quest",
      tags: ["IELTS Prep", "English Literature", "Linguistics"],
      link: "https://example.com/ielts",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600&h=400",
      date: "2025-08"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Moot Court Oral Advocacy Finals",
      description: "Presenting oral pleadings in front of supreme court judges during national mock trials.",
      image: "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?auto=format&fit=crop&q=80&w=800&h=600",
      category: "Achievement"
    },
    {
      id: "gal-2",
      title: "Inaugural Ribbon Cutting for Sami Warehouse",
      description: "Launching our direct hub logistics distribution point.",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800&h=600",
      category: "Moment"
    },
    {
      id: "gal-3",
      title: "IELTS Band 7.0 Certification Award",
      description: "Official certificate presentation acknowledging structural language mastery.",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600",
      category: "Academic"
    }
  ]
};

export const INITIAL_ANALYTICS_DATA: AnalyticsData = {
  views: 1249,
  loadingSpeed: 210, // ms
  visitorCountries: [
    { country: "Bangladesh", count: 852 },
    { country: "United Kingdom", count: 148 },
    { country: "United States", count: 120 },
    { country: "Canada", count: 81 },
    { country: "Germany", count: 48 },
  ],
  viewsByDay: [
    { day: "Mon", count: 121 },
    { day: "Tue", count: 154 },
    { day: "Wed", count: 198 },
    { day: "Thu", count: 165 },
    { day: "Fri", count: 210 },
    { day: "Sat", count: 180 },
    { day: "Sun", count: 221 },
  ]
};
