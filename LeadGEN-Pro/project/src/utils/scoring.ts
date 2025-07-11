import { Lead } from '../types/lead';

export const calculateLeadScore = (lead: Partial<Lead>): number => {
  let score = 0;
  
  // Company size scoring (0-25 points)
  if (lead.employeeCount) {
    if (lead.employeeCount >= 1000) score += 25;
    else if (lead.employeeCount >= 500) score += 20;
    else if (lead.employeeCount >= 100) score += 15;
    else if (lead.employeeCount >= 50) score += 10;
    else score += 5;
  }
  
  // Tech stack scoring (0-30 points)
  if (lead.techStack && lead.techStack.length > 0) {
    const targetTech = ['react', 'nodejs', 'aws', 'typescript', 'postgresql', 'mongodb', 'redis'];
    const matchCount = lead.techStack.filter(tech => 
      targetTech.some(target => tech.toLowerCase().includes(target.toLowerCase()))
    ).length;
    score += Math.min(matchCount * 5, 30);
  }
  
  // Industry scoring (0-20 points)
  if (lead.industry) {
    const highValueIndustries = ['technology', 'software', 'fintech', 'saas'];
    const mediumValueIndustries = ['e-commerce', 'communication', 'design'];
    
    const industryLower = lead.industry.toLowerCase();
    if (highValueIndustries.some(industry => industryLower.includes(industry))) {
      score += 20;
    } else if (mediumValueIndustries.some(industry => industryLower.includes(industry))) {
      score += 15;
    } else {
      score += 10;
    }
  }
  
  // Priority bonus (0-15 points)
  if (lead.priority) {
    switch (lead.priority) {
      case 'high': score += 15; break;
      case 'medium': score += 10; break;
      case 'low': score += 5; break;
    }
  }
  
  // Recency bonus (0-10 points)
  if (lead.createdAt) {
    const daysSinceCreated = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 7) score += 10;
    else if (daysSinceCreated <= 30) score += 5;
  }
  
  return Math.min(Math.round(score), 100);
};