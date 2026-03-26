# HealthBed AI - Frontend (Next.js)

This module handles the real-time public directory, administrative dashboards, and emergency dispatch interfaces for the HealthBed AI system. It is powered by React, Next.js, and framer-motion.

## Features
- **Real-Time Data Streams**: Leverages WebSocket integration via `socket.io-client` for zero-latency UI updates without browser refreshing.
- **Glassmorphic Interactive UI**: Built with Tailwind CSS and Framer Motion for optimized micro-animations.
- **Dynamic Render**: Includes charts, emergency alert banners, and interactive hospital routing panels.
- **Dark Mode Native**: Complete light and dark mode switching with system-theme detection.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Animations**: Framer Motion
- **WebSockets**: Socket.IO client

## Local Development Setup
1. `npm install`
2. Set `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Start the dev server: `npm run dev`
4. Navigate to `http://localhost:3000`

## Deployment
Designed specifically for deployment on Vercel. Connect your repository, point the root directory to `frontend`, and define `NEXT_PUBLIC_API_URL`.
