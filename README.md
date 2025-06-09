# SEO Audit Agent

A full-stack TypeScript application that analyzes websites for SEO optimization using AI-powered insights from GPT-4 and web scraping with Playwright.

## Features

- **AI-Powered Analysis**: Uses GPT-4 to provide intelligent SEO recommendations
- **Comprehensive Scanning**: Extracts titles, meta descriptions, H1/H2 tags, and more
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Batch Processing**: Analyze up to 10 URLs simultaneously
- **Real-time Results**: Live updates during analysis
- **Detailed Reports**: Get specific, actionable improvement suggestions

## Architecture

```
seo-audit-agent/
├── shared/           # Shared TypeScript types and utilities
├── backend/          # Express.js API server
├── frontend/         # Next.js React application
├── package.json      # Root workspace configuration
└── README.md
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (get one from https://platform.openai.com/api-keys)

## Quick Start

### ⚠️ **IMPORTANT: API Key Setup Required**

**Before running the application**, you must add your OpenAI API key:

1. **Get an OpenAI API key**: https://platform.openai.com/api-keys
2. **Edit the backend environment file**:
   ```bash
   # Open backend/.env and replace the placeholder
   OPENAI_API_KEY=sk-your-openai-api-key-here  # ← Replace with your real key
   ```

### 🚀 One-Command Setup

```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Use npm command
npm run setup && npm start
```

That's it! The script will:
- Install all dependencies
- Build shared packages
- Set up environment files
- Start both frontend and backend

### 📋 Manual Setup (if needed)

If you prefer manual setup or encounter issues:

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment files:**
   ```bash
   # Copy and edit backend environment
   cp backend/.env.example backend/.env
   # ⚠️ IMPORTANT: Edit backend/.env and replace 'sk-your-openai-api-key-here' with your real OpenAI API key
   
   # Frontend environment is already configured
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

### 🔧 Individual Services (Advanced)

```bash
# Start both services with colored output
npm run dev

# Or start individually
npm run dev:backend    # Backend only (port 3001)
npm run dev:frontend   # Frontend only (port 3000)
```

### 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Usage

1. **Enter URLs**: Add one or more URLs (one per line) in the textarea
2. **Start Analysis**: Click "Start Analysis" to begin SEO audit
3. **View Results**: Get detailed SEO scores, issues, and AI-powered suggestions
4. **Implement Changes**: Use the recommendations to improve your website's SEO

## API Endpoints

### POST /api/analyze
Analyze URLs for SEO performance.

**Request:**
```json
{
  "urls": ["https://example.com", "https://example.com/about"]
}
```

**Response:**
```json
{
  "results": [
    {
      "pageInfo": {
        "url": "https://example.com",
        "title": "Page Title",
        "metaDescription": "Meta description",
        "h1s": ["Main Heading"],
        "h2s": ["Subheading 1", "Subheading 2"]
      },
      "analysis": {
        "score": 85,
        "suggestions": ["Improve meta description length"],
        "issues": [
          {
            "type": "meta",
            "severity": "medium",
            "message": "Meta description too short",
            "suggestion": "Expand to 150-160 characters"
          }
        ]
      }
    }
  ],
  "totalProcessed": 1,
  "errors": []
}
```

### GET /api/health
Health check endpoint.

## Development Commands

### 🚀 Quick Commands
```bash
./start.sh               # Complete setup and start (recommended)  
./stop.sh                # Stop all services
npm start                # Start both services
npm run setup            # Install deps and build shared package
```

### 🛠️ Development
```bash
npm run dev              # Start both frontend and backend with colored output
npm run dev:frontend     # Start frontend only (port 3000)
npm run dev:backend      # Start backend only (port 3001)
```

### 🏗️ Building
```bash
npm run build            # Build all packages
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
npm run build:shared     # Build shared package only
```

### 🧹 Maintenance
```bash
npm run clean            # Remove all node_modules and build files
npm run clean:ports      # Kill processes on ports 3000,3001
npm run reset            # Clean and setup from scratch
```

## Project Structure

### Shared Package (`/shared`)
- **Types**: Common TypeScript interfaces and types
- **Prompts**: GPT-4 prompt templates for SEO analysis
- **Utilities**: Shared helper functions

### Backend (`/backend`)
- **Services**: 
  - `pageExtractor.ts` - Web scraping with Playwright
  - `seoAnalyzer.ts` - OpenAI GPT-4 integration
- **Routes**: API endpoints for analysis
- **Config**: Environment and application configuration

### Frontend (`/frontend`)
- **Pages**: Next.js app router pages
- **Components**: Reusable React components
- **Styles**: Tailwind CSS configuration and global styles
- **API**: Axios client for backend communication

## Configuration

### Backend Configuration
Environment variables in `backend/.env`:

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)
- `RATE_LIMIT_MAX` - Max requests per window (default: 10)
- `RATE_LIMIT_WINDOW` - Rate limit window in ms (default: 900000)

### Frontend Configuration
Environment variables in `frontend/.env.local`:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

## Deployment

### Backend Deployment
1. Build the backend: `npm run build:backend`
2. Set production environment variables
3. Start with: `npm run start` (from backend directory)

### Frontend Deployment
1. Build the frontend: `npm run build:frontend`
2. Deploy the `.next` folder to your hosting platform
3. Set `NEXT_PUBLIC_API_URL` to your production backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### 🚨 Common Issues

**Port Already in Use**
```bash
# Kill existing processes
./stop.sh
# Or manually
npm run clean:ports
```

**Dependencies Issues**
```bash
# Reset everything
npm run reset
```

**Node.js Version Issues**
- Minimum: Node.js 18.0.0
- Recommended: Node.js 18.17.0+ for optimal Next.js support
- Update from: https://nodejs.org/

**Environment Variables Missing**
```bash
# Check if files exist
ls backend/.env frontend/.env.local

# Copy from examples if missing
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

**OpenAI API Issues**
- Verify your API key in `backend/.env`
- Check your OpenAI account has credits
- Model `gpt-4o-mini` is used (cheaper alternative to GPT-4)

**Website Timeout/Bot Detection**
- The scraper includes anti-bot detection measures
- Some sites may still block automated requests
- Try with different websites for testing

### 📊 Health Checks

```bash
# Check backend health
curl http://localhost:3001/api/health

# Check if frontend is running
curl -I http://localhost:3000
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Create a new issue with detailed information
3. Include error logs and reproduction steps

## Roadmap

- [ ] CSV export functionality
- [ ] Sitemap XML analysis
- [ ] Competitor comparison
- [ ] Historical tracking
- [ ] Email reports
- [ ] Mobile-specific analysis 