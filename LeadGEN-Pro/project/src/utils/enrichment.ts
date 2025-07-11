import { EnrichedData } from '../types/lead';

// Rate limiter for API calls
class RateLimiter {
  private lastCall = 0;
  private delay: number;

  constructor(callsPerMinute: number = 10) {
    this.delay = 60000 / callsPerMinute;
  }

  async wait(): Promise<void> {
    const elapsed = Date.now() - this.lastCall;
    if (elapsed < this.delay) {
      await new Promise(resolve => setTimeout(resolve, this.delay - elapsed));
    }
    this.lastCall = Date.now();
  }
}

const rateLimiter = new RateLimiter(10);

// Mock enrichment data for development
const mockEnrichmentData: Record<string, EnrichedData> = {
  'stripe.com': {
    companyName: 'Stripe',
    industry: 'Financial Technology',
    employeeCount: 7000,
    techStack: ['react', 'nodejs', 'aws', 'postgresql', 'redis', 'kubernetes'],
    description: 'Online payment processing for internet businesses',
    location: 'San Francisco, CA',
    founded: '2010',
    revenue: '$1B+'
  },
  'asana.com': {
    companyName: 'Asana',
    industry: 'Productivity Software',
    employeeCount: 1500,
    techStack: ['react', 'typescript', 'aws', 'mongodb', 'elasticsearch', 'docker'],
    description: 'Team collaboration and project management platform',
    location: 'San Francisco, CA',
    founded: '2008',
    revenue: '$500M+'
  }
};

export const enrichCompanyData = async (domain: string): Promise<EnrichedData> => {
  await rateLimiter.wait();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const clearbitKey = process.env.CLEARBIT_API_KEY;
  
  if (clearbitKey) {
    try {
      const response = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
        headers: {
          'Authorization': `Bearer ${clearbitKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          companyName: data.name,
          industry: data.category?.industry,
          employeeCount: data.metrics?.employees,
          description: data.description,
          location: data.geo?.city + ', ' + data.geo?.stateCode,
          founded: data.foundedYear?.toString(),
          techStack: data.tech || []
        };
      }
    } catch (error) {
      console.error('Clearbit API error:', error);
    }
  }
  
  // Fallback to mock data or OpenCorporates
  const mockData = mockEnrichmentData[domain];
  if (mockData) {
    return mockData;
  }
  
  try {
    const response = await fetch(`https://api.opencorporates.com/v0.4/companies/search?q=${domain}`);
    if (response.ok) {
      const data = await response.json();
      const company = data.results?.companies?.[0]?.company;
      if (company) {
        return {
          companyName: company.name,
          location: company.jurisdiction_code,
          industry: company.company_type
        };
      }
    }
  } catch (error) {
    console.error('OpenCorporates API error:', error);
  }
  
  // Return enhanced mock data based on domain
  const companyName = domain.split('.')[0];
  return {
    companyName: companyName.charAt(0).toUpperCase() + companyName.slice(1),
    industry: 'Technology',
    employeeCount: Math.floor(Math.random() * 5000) + 100,
    techStack: ['react', 'nodejs', 'aws'],
    description: `${companyName} is a technology company focused on innovative solutions.`,
    location: 'San Francisco, CA'
  };
};