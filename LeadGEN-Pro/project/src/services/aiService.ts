// Mock AI service for generating leads and content
// In a real implementation, this would connect to Google Gemini or similar AI service

export interface GeneratedLead {
  companyName: string;
  domain: string;
  industry: string;
  employeeCount: number;
  location: string;
  description: string;
  techStack: string[];
  contactEmail: string;
  linkedinUrl: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export interface LinkedInMessage {
  message: string;
}

// Mock data for different industries and locations
const mockCompanies = {
  technology: [
    { name: 'TechFlow Solutions', domain: 'techflow.com', description: 'Cloud-based workflow automation platform' },
    { name: 'DataSync Pro', domain: 'datasync.io', description: 'Real-time data synchronization services' },
    { name: 'CloudVault Systems', domain: 'cloudvault.net', description: 'Enterprise cloud storage solutions' },
    { name: 'AI Insights Corp', domain: 'aiinsights.ai', description: 'Machine learning analytics platform' },
    { name: 'DevOps Central', domain: 'devopscentral.com', description: 'DevOps automation and monitoring tools' }
  ],
  healthcare: [
    { name: 'MedTech Innovations', domain: 'medtech-inn.com', description: 'Digital health monitoring solutions' },
    { name: 'HealthSync Platform', domain: 'healthsync.care', description: 'Patient data management system' },
    { name: 'CareConnect Solutions', domain: 'careconnect.health', description: 'Telemedicine platform provider' },
    { name: 'BioData Analytics', domain: 'biodata.med', description: 'Healthcare data analytics and insights' }
  ],
  finance: [
    { name: 'FinTech Dynamics', domain: 'fintech-dyn.com', description: 'Digital banking solutions' },
    { name: 'PayStream Solutions', domain: 'paystream.finance', description: 'Payment processing platform' },
    { name: 'InvestPro Analytics', domain: 'investpro.finance', description: 'Investment portfolio management' },
    { name: 'CryptoVault Systems', domain: 'cryptovault.secure', description: 'Cryptocurrency security solutions' }
  ]
};

const techStacks = {
  technology: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'PostgreSQL'],
  healthcare: ['React', 'Python', 'AWS', 'HIPAA Compliance', 'MongoDB', 'Redis'],
  finance: ['React', 'Java', 'AWS', 'Blockchain', 'PostgreSQL', 'Security Protocols']
};

const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Denver, CO', 'Atlanta, GA', 'Chicago, IL', 'Los Angeles, CA', 'Miami, FL'
];

export const generateLeads = async (params: {
  industry: string;
  location: string;
  companySize: string;
  count: number;
}): Promise<GeneratedLead[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const industryCompanies = mockCompanies[params.industry as keyof typeof mockCompanies] || mockCompanies.technology;
  const industryTechStack = techStacks[params.industry as keyof typeof techStacks] || techStacks.technology;
  
  const sizeRanges = {
    startup: { min: 5, max: 50 },
    small: { min: 51, max: 200 },
    medium: { min: 201, max: 1000 },
    large: { min: 1001, max: 5000 },
    enterprise: { min: 5001, max: 50000 }
  };

  const range = sizeRanges[params.companySize as keyof typeof sizeRanges] || sizeRanges.medium;

  return Array.from({ length: params.count }, (_, index) => {
    const company = industryCompanies[index % industryCompanies.length];
    const employeeCount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    const selectedTechStack = industryTechStack
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 3);

    return {
      companyName: company.name,
      domain: company.domain,
      industry: params.industry,
      employeeCount,
      location: params.location || locations[Math.floor(Math.random() * locations.length)],
      description: company.description,
      techStack: selectedTechStack,
      contactEmail: `contact@${company.domain}`,
      linkedinUrl: `https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, '-')}`
    };
  });
};

export const generateEmailContent = async (lead: any, userInfo?: any): Promise<EmailContent> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const subjects = [
    `Partnership Opportunity with ${lead.companyName}`,
    `Scaling ${lead.companyName}'s ${lead.industry} Operations`,
    `Quick Question About ${lead.companyName}'s Growth`,
    `Helping ${lead.companyName} Optimize Performance`,
    `${lead.companyName} + Our Solution = Success`
  ];

  const subject = subjects[Math.floor(Math.random() * subjects.length)];

  const body = `Hi there,

I hope this email finds you well. I've been following ${lead.companyName}'s work in ${lead.industry} and I'm impressed by your approach to ${lead.description?.toLowerCase() || 'innovation'}.

Given that you're working with ${lead.techStack.slice(0, 2).join(' and ')}, I thought you might be interested in how we've helped similar companies in ${lead.location} achieve:

• 40% reduction in operational costs
• 60% faster deployment cycles  
• 99.9% uptime reliability

Would you be open to a brief 15-minute call this week to discuss how this could benefit ${lead.companyName}? I have some specific ideas that could be valuable for a ${lead.employeeCount}-person team like yours.

Best regards,
[Your Name]

P.S. I'd be happy to share a case study from another ${lead.industry} company that saw similar results.`;

  return { subject, body };
};

export const generateLinkedInMessage = async (lead: any): Promise<LinkedInMessage> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const messages = [
    `Hi! I noticed ${lead.companyName}'s innovative work in ${lead.industry}. Would love to connect and share some insights that might be valuable for your ${lead.techStack[0]} implementation.`,
    
    `Hello! Impressed by ${lead.companyName}'s growth in ${lead.location}. I work with ${lead.industry} companies and have some ideas that could help scale your operations. Would you be open to connecting?`,
    
    `Hi there! I've been following ${lead.companyName} and your approach to ${lead.description?.split(' ').slice(0, 3).join(' ') || 'innovation'}. I'd love to connect and share some relevant insights from the ${lead.industry} space.`,
    
    `Hello! I help ${lead.industry} companies optimize their ${lead.techStack[0]} infrastructure. Given ${lead.companyName}'s growth trajectory, I thought you might find our recent case studies interesting. Connect?`,
    
    `Hi! I work with ${lead.employeeCount < 500 ? 'growing' : 'established'} ${lead.industry} companies in ${lead.location}. Would love to connect and share some insights that could be valuable for ${lead.companyName}.`
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return { message };
};