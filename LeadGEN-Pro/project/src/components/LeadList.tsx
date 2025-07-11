import React from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Lead } from '../types/lead';
import { ScoreIndicator } from './ScoreIndicator';
import { PriorityBadge } from './PriorityBadge';

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onEnrichLead: (leadId: string) => void;
  enrichingLeads: Set<string>;
}

export const LeadList: React.FC<LeadListProps> = ({
  leads,
  onSelectLead,
  onEnrichLead,
  enrichingLeads
}) => {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ExternalLink className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">No leads found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        Lead Pipeline
      </h2>
      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="group lead-card glass rounded-xl p-4 cursor-pointer hover-lift"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {lead.companyName}
                  </h3>
                  <PriorityBadge priority={lead.priority} />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{lead.domain}</span>
                  <span>•</span>
                  <span>{lead.industry}</span>
                  <span>•</span>
                  <span>{lead.employeeCount} employees</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <ScoreIndicator score={lead.score} />
                  <span className="text-sm text-gray-600">Score: {lead.score}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnrichLead(lead.id);
                  }}
                  disabled={enrichingLeads.has(lead.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover-lift disabled:opacity-50"
                  title="Enrich company data"
                >
                  <RefreshCw className={`h-4 w-4 ${enrichingLeads.has(lead.id) ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            {lead.techStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {lead.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="tech-tag px-2 py-1 text-blue-800 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {lead.techStack.length > 3 && (
                  <span className="px-2 py-1 glass text-gray-600 text-xs rounded-full">
                    +{lead.techStack.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};