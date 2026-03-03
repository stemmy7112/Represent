export interface Opportunity {
  id: string;
  category: string;
  title: string;
  description: string;
  automationLevel: number; // 1-10
  speedToCash: number; // 1-10
  competitionScore: number; // 1-10
  score: number;
  timeToCash: string;
  createdAt: string;
}

export function calculateScore(
  automationLevel: number,
  speedToCash: number,
  competitionScore: number
): number {
  return Number(
    ((automationLevel * 0.4 + speedToCash * 0.4 - competitionScore * 0.2) * 10).toFixed(1)
  );
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    category: "AI Services",
    title: "AI Chatbot Setup Agency",
    description: "Set up custom AI chatbots for local businesses using no-code tools.",
    automationLevel: 9,
    speedToCash: 8,
    competitionScore: 4,
    timeToCash: "24-48h",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    category: "E-Commerce",
    title: "Print-on-Demand Store",
    description: "Automated POD store with trending designs and social media marketing.",
    automationLevel: 8,
    speedToCash: 6,
    competitionScore: 7,
    timeToCash: "3-5 days",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    category: "Content",
    title: "Faceless YouTube Automation",
    description: "AI-generated scripts, voiceover, and editing for niche YouTube channels.",
    automationLevel: 7,
    speedToCash: 4,
    competitionScore: 6,
    timeToCash: "2-4 weeks",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    category: "Freelancing",
    title: "LinkedIn Lead Gen Service",
    description: "Automated outreach and appointment setting for B2B companies.",
    automationLevel: 7,
    speedToCash: 9,
    competitionScore: 5,
    timeToCash: "12-24h",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    category: "SaaS",
    title: "Micro-SaaS Tool",
    description: "Build a focused SaaS solving one specific pain point with AI.",
    automationLevel: 6,
    speedToCash: 3,
    competitionScore: 3,
    timeToCash: "1-2 weeks",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    category: "Digital Products",
    title: "Notion Template Store",
    description: "Create and sell premium Notion templates on Gumroad.",
    automationLevel: 8,
    speedToCash: 7,
    competitionScore: 6,
    timeToCash: "1-3 days",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    category: "AI Services",
    title: "AI Content Repurposing",
    description: "Turn long-form content into social posts, emails, and ads using AI.",
    automationLevel: 9,
    speedToCash: 8,
    competitionScore: 3,
    timeToCash: "12-24h",
    score: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    category: "Consulting",
    title: "AI Implementation Consulting",
    description: "Help businesses integrate AI tools into their workflows.",
    automationLevel: 4,
    speedToCash: 9,
    competitionScore: 3,
    timeToCash: "24-48h",
    score: 0,
    createdAt: new Date().toISOString(),
  },
].map((opp) => ({
  ...opp,
  score: calculateScore(opp.automationLevel, opp.speedToCash, opp.competitionScore),
})).sort((a, b) => b.score - a.score);
