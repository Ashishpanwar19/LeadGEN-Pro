import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, TrendingUp, Users, Target, Star, Sparkles, Brain } from 'lucide-react';
import { LeadList } from './LeadList';
import { LeadDetail } from './LeadDetail';
import { MetricCard } from './MetricCard';
import { AddLeadModal } from './AddLeadModal';
import { LeadGenerator } from './LeadGenerator';
import { AIContentGenerator } from './AIContentGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Lead } from '../types/lead';
import { loadSampleLeads } from '../utils/sampleData';
import { enrichCompanyData } from '../utils/enrichment';
import { calculateLeadScore } from '../utils/scoring';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enrichingLeads, setEnrichingLeads] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const initializeData = async () => {
      try {
        const sampleLeads = await loadSampleLeads();
        setLeads(sampleLeads);
      } catch (error) {
        console.error('Failed to load sample data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleEnrichLead = async (leadId: string) => {
    setEnrichingLeads(prev => new Set(prev).add(leadId));
    
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const enrichedData = await enrichCompanyData(lead.domain);
      const updatedLead = {
        ...lead,
        ...enrichedData,
        score: calculateLeadScore({ ...lead, ...enrichedData }),
        lastEnriched: new Date().toISOString()
      };

      setLeads(prev => prev.map(l => l.id === leadId ? updatedLead : l));
    } catch (error) {
      console.error('Failed to enrich lead:', error);
    } finally {
      setEnrichingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdAt' | 'score'>) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      score: calculateLeadScore(newLead)
    };
    setLeads(prev => [lead, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleLeadsGenerated = (newLeads: Lead[]) => {
    setLeads(prev => [...newLeads, ...prev]);
    setActiveTab('dashboard');
  };

  const handleContentGenerated = (leadId: string, content: { email?: string; linkedin?: string; videoCall?: string }) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            generatedEmail: content.email || lead.generatedEmail,
            generatedLinkedinMessage: content.linkedin || lead.generatedLinkedinMessage,
            videoCallLink: content.videoCall || lead.videoCallLink
          }
        : lead
    ));
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || lead.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const metrics = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.score >= 70).length,
    avgScore: Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length || 0),
    topPriority: leads.filter(l => l.priority === 'high').length
  };

  const handleExport = () => {
    const csv = [
      ['Company', 'Domain', 'Industry', 'Employees', 'Score', 'Priority', 'Tech Stack'],
      ...filteredLeads.map(lead => [
        lead.companyName,
        lead.domain,
        lead.industry,
        lead.employeeCount,
        lead.score,
        lead.priority,
        lead.techStack.join(';')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 neural-bg">
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-ai p-2 rounded-lg animate-pulse-glow">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LeadGen Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 glass hover:glass-dark rounded-lg transition-all hover-lift"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-primary hover:bg-gradient-secondary text-white rounded-lg transition-all hover-lift animate-shimmer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Leads
            </TabsTrigger>
            <TabsTrigger value="ai-content" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Leads"
                value={metrics.totalLeads}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Qualified Leads"
                value={metrics.qualifiedLeads}
                icon={Star}
                color="green"
              />
              <MetricCard
                title="Average Score"
                value={metrics.avgScore}
                icon={TrendingUp}
                color="purple"
              />
              <MetricCard
                title="High Priority"
                value={metrics.topPriority}
                icon={Target}
                color="orange"
              />
            </div>

            <div className="glass rounded-xl shadow-xl border border-white/30 overflow-hidden">
              <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="pl-10 pr-8 py-2 glass rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredLeads.length} of {leads.length} leads
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2 xl:col-span-2">
                  <LeadList
                    leads={filteredLeads}
                    onSelectLead={setSelectedLead}
                    onEnrichLead={handleEnrichLead}
                    enrichingLeads={enrichingLeads}
                  />
                </div>
                <div className="lg:col-span-1 xl:col-span-1">
                  <LeadDetail lead={selectedLead} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <LeadGenerator onLeadsGenerated={handleLeadsGenerated} />
          </TabsContent>

          <TabsContent value="ai-content" className="space-y-6">
            {selectedLead ? (
              <AIContentGenerator 
                lead={selectedLead} 
                onContentGenerated={handleContentGenerated}
              />
            ) : (
              <div className="text-center py-12 glass rounded-xl">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a lead from the dashboard to generate AI content</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLead}
      />
    </div>
  );
};