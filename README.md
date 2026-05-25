# Automated Code Reviewer

A production-ready full-stack application for AI-powered source code review.

## Features

- Monaco editor with syntax highlighting and dynamic language switching
- REST API backend with Express.js and MongoDB
- AI review via xAI/Grok or Groq provider
- Review history persistence in MongoDB
- Analytics dashboard with language usage and issue distribution
- Responsive UI with dark/light theme and toast notifications
- Vercel-ready deployment for frontend and backend

## Tech Stack

- Frontend: React, Vite, React Router DOM, Axios, Monaco Editor
- Backend: Node.js, Express, REST API
- Database: MongoDB, Mongoose
- AI Provider: xAI/Grok or Groq
- Deployment: Vercel

## Setup

1. Copy `.env.example` to `.env` and set your values.
2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Start the frontend locally:

   ```bash
   npm run dev
   ```

4. Start the backend locally for development:

   ```bash
   npm --prefix server run dev
   ```

The client calls the backend through relative `/api` URLs. In local development, Vite proxies `/api` to `http://localhost:5000`. On Vercel, `/api/*` is routed to the serverless Express app, so the frontend and backend deploy together under the same domain.

## Environment Variables

- `PORT` - backend server port
- `MONGODB_URI` - MongoDB connection string
- `XAI_API_KEY` - xAI/Grok API key
- `XAI_MODEL` - xAI/Grok model (default `grok-4.3`)
- `XAI_BASE_URL` - optional xAI-compatible base URL (default `https://api.x.ai/v1`)
- `GROQ_API_KEY` - Groq API key
- `GROQ_MODEL` - Groq model (default `llama-3.3-70b-versatile`)
- `GROQ_BASE_URL` - optional Groq-compatible base URL (default `https://api.groq.com/openai/v1`)
- `AI_PROVIDER` - optional provider key: `xai`, `grok`, or `groq`

## Deployment

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Add the required environment variables in Vercel Project Settings.
4. Deploy from the project root:

   ```bash
   vercel --prod
   ```

Vercel will build the frontend and backend using `vercel.json`.

## Project Structure

- `client/` - React application
- `server/` - Express API, Mongoose models, AI service layers
- `.env.example` - environment variables template
- `vercel.json` - Vercel deployment configuration

## API Endpoints

- `POST /api/review`
- `GET /api/reviews`
- `GET /api/analytics`
- `DELETE /api/review/:id`
