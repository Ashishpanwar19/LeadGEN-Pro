import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Mail, MessageCircle, Loader2, Copy, Check, Video } from 'lucide-react';
import { generateEmailContent, generateLinkedInMessage } from '../services/aiService';
import { Lead } from '../types/lead';
import { generateVideoCallLink } from '../lib/utils';

interface AIContentGeneratorProps {
  lead: Lead;
  onContentGenerated: (leadId: string, content: { email?: string; linkedin?: string; videoCall?: string }) => void;
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ lead, onContentGenerated }) => {
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState(false);
  const [emailContent, setEmailContent] = useState<{ subject: string; body: string } | null>(null);
  const [linkedinContent, setLinkedinContent] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    try {
      const content = await generateEmailContent(lead);
      setEmailContent(content);
      onContentGenerated(lead.id, { email: `${content.subject}\n\n${content.body}` });
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    setIsGeneratingLinkedIn(true);
    try {
      const content = await generateLinkedInMessage(lead);
      setLinkedinContent(content.message);
      onContentGenerated(lead.id, { linkedin: content.message });
    } catch (error) {
      console.error('Failed to generate LinkedIn message:', error);
    } finally {
      setIsGeneratingLinkedIn(false);
    }
  };

  const handleGenerateVideoCall = () => {
    const videoCallLink = generateVideoCallLink();
    onContentGenerated(lead.id, { videoCall: videoCallLink });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [type]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [type]: false });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-white/30 hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600 animate-float" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Email Generator
            </span>
          </CardTitle>
          <CardDescription>
            Generate personalized cold emails for {lead.companyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="glass">{lead.industry}</Badge>
            <Badge variant="secondary" className="glass">{lead.employeeCount} employees</Badge>
            <Badge variant="secondary" className="glass">Score: {lead.score}</Badge>
          </div>
          
          <Button 
            onClick={handleGenerateEmail} 
            disabled={isGeneratingEmail}
            className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all hover-lift"
          >
            {isGeneratingEmail ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 neon-blue" />
                Generating Email...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>

          {emailContent && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(emailContent.subject, 'subject')}
                  >
                    {copiedStates.subject ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Textarea
                  value={emailContent.subject}
                  onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                  className="min-h-[40px] glass"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Email Body</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(emailContent.body, 'body')}
                  >
                    {copiedStates.body ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Textarea
                  value={emailContent.body}
                  onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
                  className="min-h-[200px] glass"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-white/30 hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600 animate-float" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinkedIn Message Generator
            </span>
          </CardTitle>
          <CardDescription>
            Create engaging LinkedIn connection requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerateLinkedIn} 
            disabled={isGeneratingLinkedIn}
            className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all hover-lift"
          >
            {isGeneratingLinkedIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 neon-blue" />
                Generating Message...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Generate LinkedIn Message
              </>
            )}
          </Button>

          {linkedinContent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">LinkedIn Message</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(linkedinContent, 'linkedin')}
                >
                  {copiedStates.linkedin ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={linkedinContent}
                onChange={(e) => setLinkedinContent(e.target.value)}
                className="min-h-[120px] glass"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-white/30 hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600 animate-float" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Call Generator
            </span>
          </CardTitle>
          <CardDescription>
            Generate instant video call links for meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateVideoCall} className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all hover-lift">
            <Video className="h-4 w-4 mr-2" />
            Generate Video Call Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};