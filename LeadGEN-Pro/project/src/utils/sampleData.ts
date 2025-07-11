import { Lead } from '../types/lead';
import { calculateLeadScore } from './scoring';

const sampleLeadsData = [
  {
    companyName: 'Stripe',
    domain: 'stripe.com',
    industry: 'Financial Technology',
    employeeCount: 7000,
    techStack: ['react', 'nodejs', 'aws', 'postgresql', 'redis']
  },
  {
    companyName: 'Asana',
    domain: 'asana.com',
    industry: 'Productivity Software',
    employeeCount: 1500,
    techStack: ['react', 'typescript', 'aws', 'mongodb', 'elasticsearch']
  },
  {
    companyName: 'Zoom',
    domain: 'zoom.us',
    industry: 'Communication',
    employeeCount: 7000,
    techStack: ['react', 'nodejs', 'aws', 'mysql', 'redis']
  },
  {
    companyName: 'Notion',
    domain: 'notion.so',
    industry: 'Productivity Software',
    employeeCount: 500,
    techStack: ['react', 'nodejs', 'aws', 'postgresql', 'typescript']
  },
  {
    companyName: 'Figma',
    domain: 'figma.com',
    industry: 'Design Software',
    employeeCount: 800,
    techStack: ['typescript', 'react', 'nodejs', 'aws', 'postgresql']
  },
  {
    companyName: 'Shopify',
    domain: 'shopify.com',
    industry: 'E-commerce',
    employeeCount: 10000,
    techStack: ['react', 'ruby', 'mysql', 'redis', 'elasticsearch']
  },
  {
    companyName: 'Discord',
    domain: 'discord.com',
    industry: 'Communication',
    employeeCount: 600,
    techStack: ['react', 'nodejs', 'mongodb', 'redis', 'elasticsearch']
  },
  {
    companyName: 'Canva',
    domain: 'canva.com',
    industry: 'Design Software',
    employeeCount: 3000,
    techStack: ['react', 'nodejs', 'aws', 'postgresql', 'redis']
  },
  {
    companyName: 'Spotify',
    domain: 'spotify.com',
    industry: 'Music Streaming',
    employeeCount: 8000,
    techStack: ['react', 'nodejs', 'aws', 'postgresql', 'kafka']
  },
  {
    companyName: 'Airtable',
    domain: 'airtable.com',
    industry: 'Database Software',
    employeeCount: 1000,
    techStack: ['react', 'nodejs', 'aws', 'mysql', 'redis']
  }
];

export const loadSampleLeads = async (): Promise<Lead[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return sampleLeadsData.map((data, index) => {
    const priority = index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low';
    const lead = {
      id: (index + 1).toString(),
      ...data,
      priority,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    return {
      ...lead,
      score: calculateLeadScore(lead)
    };
  });
};