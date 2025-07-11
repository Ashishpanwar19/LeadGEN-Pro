import React from 'react';
import { Building, Globe, Users, Calendar, Code, MapPin, Mail, Linkedin, Video, ExternalLink } from 'lucide-react';
import { Lead } from '../types/lead';
import { ScoreIndicator } from './ScoreIndicator';
import { PriorityBadge } from './PriorityBadge';
import { Button } from './ui/button';
import { generateGoogleMapsUrl } from '../lib/utils';

interface LeadDetailProps {
  lead: Lead | null;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead }) => {
  if (!lead) {
    return (
      <div className="glass rounded-xl p-8 text-center particles">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select a lead to view details</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-white/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            {lead.companyName}
          </h2>
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={lead.priority} />
            <ScoreIndicator score={lead.score} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Domain</p>
              <a
                href={`https://${lead.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {lead.domain}
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Industry</p>
              <p className="font-medium">{lead.industry}</p>
            </div>
          </div>

          {lead.location && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{lead.location}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(generateGoogleMapsUrl(lead.companyName, lead.location), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Employees</p>
              <p className="font-medium">{lead.employeeCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Added</p>
              <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {lead.description && (
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{lead.description}</p>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Technology Stack</span>
          </h3>
          {lead.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {lead.techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-tag px-3 py-1 text-blue-800 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tech stack data available</p>
          )}
        </div>

        {(lead.contactEmail || lead.linkedinUrl || lead.videoCallLink) && (
          <div className="border-t pt-6">
            <h3 className="font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              {lead.contactEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${lead.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {lead.contactEmail}
                  </a>
                </div>
              )}
              {lead.linkedinUrl && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-4 w-4 text-gray-400" />
                  <a
                    href={lead.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {lead.videoCallLink && (
                <div className="flex items-center space-x-3">
                  <Video className="h-4 w-4 text-gray-400" />
                  <a
                    href={lead.videoCallLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Join Video Call
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {(lead.generatedEmail || lead.generatedLinkedinMessage) && (
          <div className="border-t pt-6">
            <h3 className="font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Generated Content
            </h3>
            <div className="space-y-3">
              {lead.generatedEmail && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Content</p>
                  <div className="glass p-3 rounded-lg text-xs">
                    <pre className="whitespace-pre-wrap">{lead.generatedEmail}</pre>
                  </div>
                </div>
              )}
              {lead.generatedLinkedinMessage && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">LinkedIn Message</p>
                  <div className="glass p-3 rounded-lg text-xs">
                    {lead.generatedLinkedinMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Lead Score Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Company Size</span>
              <span className="font-medium">{Math.min(lead.employeeCount / 50, 25)}/25</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tech Stack Match</span>
              <span className="font-medium">{lead.techStack.length * 5}/30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Industry Fit</span>
              <span className="font-medium">
                {lead.industry.toLowerCase().includes('tech') ? '20' : '15'}/20
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Priority Bonus</span>
              <span className="font-medium">
                {lead.priority === 'high' ? '15' : lead.priority === 'medium' ? '10' : '5'}/15
              </span>
            </div>
          </div>
        </div>

        {lead.lastEnriched && (
          <div className="text-xs text-gray-500 pt-4 border-t">
            Last enriched: {new Date(lead.lastEnriched).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};