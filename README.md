LeadGen Pro: AI-Powered Sales Outreach Platform

Transform your sales process with LeadGen Pro – a cutting-edge AI platform that automates lead generation, prioritization, and outreach so you can focus on closing deals faster.
🚀 Key Features
Smart Lead Management

    AI-Powered Lead Generation: Instantly discover high-quality leads matching your ideal customer profile (industry, location, company size).

    Intelligent Lead Scoring: AI-generated scores (0-100) help you prioritize the hottest opportunities.

Automated Multi-Channel Outreach

    Personalized Cold Emails: AI-crafted, high-conversion emails tailored to each lead.

    LinkedIn Message Generator: Engaging connection requests to build relationships effortlessly.

Powerful Engagement Tools

    Real-Time Dashboard: Track lead generation and scoring metrics at a glance.

    One-Click Location Mapping: Visualize lead locations with Google Maps integration.

    Instant Meeting Links: Generate unique Jitsi video call links in seconds.

Secure & Scalable

    Firebase Authentication: Enterprise-grade security with full user management.

    Modern UI: Sleek, responsive interface with light/dark mode (built with ShadCN UI + Tailwind CSS).

💻 Tech Stack

    Framework: Next.js 15 (App Router)

    Language: TypeScript

    Styling: Tailwind CSS + ShadCN UI

    AI Engine: Genkit with Google Gemini 2.0 Flash

    Auth: Firebase Authentication

🛠️ Installation Guide
Prerequisites

    Node.js (v18+)

    Git

Setup Instructions

    Clone the repo:
    bash

git clone https://github.com/Ashishpanwar19/LeadGEN-Pro.git
cd YOUR_REPOSITORY_NAME

Configure environment variables:
Create .env.local in the root directory and add:
env

# Firebase Config (from Project Settings > General)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google AI Key (from Google AI Studio)
GOOGLE_API_KEY=your-ai-key

Install dependencies:
bash

npm install

Launch the app:
bash

    npm run dev

Pro Tip: For production deployment, configure Firebase Hosting or Vercel for seamless scaling.
