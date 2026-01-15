# Tradeomony - B2B Export-Import Marketplace

A modern B2B marketplace connecting Indian exporters and importers.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── ...
├── lib/             # Utility functions and configurations
│   ├── supabase/    # Supabase client setup
│   └── utils.ts     # Helper functions
└── types/           # TypeScript type definitions
```

## Features

- User authentication (Exporters & Importers)
- Product listing and discovery
- Advanced search and filtering
- Inquiry/RFQ system
- Messaging between buyers and sellers
- User dashboards
- Premium B2B design with smooth animations
