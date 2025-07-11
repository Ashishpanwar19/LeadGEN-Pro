import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Target, Loader2 } from 'lucide-react';
import { generateLeads, GeneratedLead } from '../services/aiService';
import { Lead } from '../types/lead';
import { calculateLeadScore } from '../utils/scoring';

interface LeadGeneratorProps {
  onLeadsGenerated: (leads: Lead[]) => void;
}

export const LeadGenerator: React.FC<LeadGeneratorProps> = ({ onLeadsGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    industry: 'technology',
    location: 'San Francisco, CA',
    companySize: 'medium',
    count: 5
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedLeads = await generateLeads(formData);
      
      const leads: Lead[] = generatedLeads.map((generated, index) => ({
        id: `generated-${Date.now()}-${index}`,
        companyName: generated.companyName,
        domain: generated.domain,
        industry: generated.industry,
        employeeCount: generated.employeeCount,
        techStack: generated.techStack,
        location: generated.location,
        description: generated.description,
        contactEmail: generated.contactEmail,
        linkedinUrl: generated.linkedinUrl,
        priority: 'medium' as const,
        createdAt: new Date().toISOString(),
        score: 0
      }));

      // Calculate scores for generated leads
      const scoredLeads = leads.map(lead => ({
        ...lead,
        score: calculateLeadScore(lead)
      }));

      onLeadsGenerated(scoredLeads);
    } catch (error) {
      console.error('Failed to generate leads:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full glass border-white/30 hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 animate-float" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Lead Generator
          </span>
        </CardTitle>
        <CardDescription>
          Generate high-quality leads tailored to your ideal customer profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="quick">Quick Generate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="flex h-10 w-full rounded-md glass px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                  className="glass"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="flex h-10 w-full rounded-md glass px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="startup">Startup (5-50)</option>
                  <option value="small">Small (51-200)</option>
                  <option value="medium">Medium (201-1000)</option>
                  <option value="large">Large (1001-5000)</option>
                  <option value="enterprise">Enterprise (5000+)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="count">Number of Leads</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 5 })}
                  className="glass"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Advanced filtering options coming soon! For now, use the quick generate tab to create leads.
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-primary hover:bg-gradient-secondary transition-all hover-lift"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin neon-blue" />
                Generating...
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Generate Leads
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};