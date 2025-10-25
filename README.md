# ProfileCheck - Plinq Competitor MVP

A modern people search platform built with Next.js 14, OpenAI GPT-4, and multiple data sources.

## Features

- **AI-Powered Search**: Uses GPT-4 to analyze and enrich profile data
- **Multi-Source Verification**: Aggregates data from social media, public records, and web sources
- **Verification System**: Trust scores and verification badges for profile reliability
- **Modern UI**: Built with Tailwind CSS and responsive design
- **Fast Performance**: Serverless deployment on Vercel

## Tech Stack

- **Frontend/Backend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **APIs**: Hunter.io, SerpAPI, Google Custom Search
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plinq-competitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Fill in your API keys:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `HUNTER_API_KEY`: Hunter.io API key (optional)
   - `SERPAPI_KEY`: SerpAPI key (optional)
   - `GOOGLE_CSE_ID`: Google Custom Search Engine ID
   - `GOOGLE_API_KEY`: Google API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## API Keys Setup

### Required
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Optional (for enhanced features)
- **Hunter.io**: Email finding service - [Sign up here](https://hunter.io)
- **SerpAPI**: Search engine results - [Sign up here](https://serpapi.com)
- **Google Custom Search**: Web search API - [Setup guide](https://developers.google.com/custom-search/v1/introduction)

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── search/            # Search results
│   ├── profile/[id]/      # Profile details
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
│   ├── apis/             # API integrations
│   └── openai.ts         # OpenAI client
└── types/                # TypeScript definitions
```

## Features Overview

### Search Interface
- Simple search by name, email, phone, or social handle
- Real-time search results
- Advanced filtering options

### Profile Aggregation
- Collects data from multiple sources
- Social media profiles (LinkedIn, Twitter, etc.)
- Professional information
- Contact details

### AI Enhancement
- GPT-4 powered profile analysis
- Professional summaries
- Credibility assessments
- Risk factor identification

### Verification System
- Trust score calculation (0-100)
- Verification levels: Verified, Trusted, Basic, Limited
- Data source reliability indicators
- Cross-reference validation

## API Endpoints

- `GET /api/search?q={query}` - Search for profiles
- `POST /api/search` - Advanced search with filters
- `POST /api/enrich` - Enhance profile with AI
- `GET /api/enrich?profileId={id}` - Get enrichment data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub.