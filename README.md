# APEX MOTORS — Luxury Performance Automotive

A modern, cinematic luxury automotive website showcasing the world's most exclusive high-performance vehicles. Built with a premium dark UI, glassmorphism effects, and immersive animations.

## Features

- **Cinematic Homepage** — Full-screen hero with ambient lighting effects and category sections
- **Global Search** — Instant search with thumbnails, filters by category, sort by HP/speed/year/price
- **Dynamic Car Detail Pages** — Hero images, full specifications, gallery, performance metrics, similar cars
- **Car Comparison** — Side-by-side comparison of up to 3 vehicles with highlighted best values
- **Favorites System** — Save cars with localStorage persistence
- **30+ Elite Vehicles** — Porsche, BMW M, Mercedes AMG, Audi RS, Lamborghini, Ferrari, McLaren, Nissan GT-R, Toyota Supra, Koenigsegg, Bugatti, Pagani, Honda NSX, and more
- **Category Sections** — Hypercars, German Performance, JDM Legends, Supercars, Exotic Classics
- **Responsive Design** — Mobile-first, works across all devices
- **Dark Mode Only** — Aggressive black/dark gray UI with glassmorphism
- **Smooth Animations** — Framer Motion transitions throughout

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Language | TypeScript |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + Tailwind
│   ├── cars/[id]/page.tsx  # Car detail pages
│   ├── search/page.tsx     # Search & filter page
│   ├── compare/page.tsx    # Car comparison
│   └── favorites/page.tsx  # Saved favorites
├── components/
│   ├── Navbar.tsx           # Responsive nav with search
│   ├── HeroSection.tsx      # Cinematic hero banner
│   ├── CarCard.tsx          # Interactive car cards
│   ├── CategorySection.tsx  # Category grid layout
│   ├── CompareBar.tsx       # Floating compare bar
│   ├── FeaturedStats.tsx    # Stats counter section
│   └── Footer.tsx           # Site footer
├── data/
│   └── cars.ts              # Car database + helpers
├── hooks/
│   ├── useFavorites.ts      # Favorites state (localStorage)
│   ├── useCompare.ts        # Compare list state
│   └── useSearch.ts         # Search logic
├── types/
│   └── car.ts               # TypeScript interfaces
└── lib/
    └── utils.ts             # Utility functions
```

## Design Direction

- Black/dark gray UI with glassmorphism
- Aggressive Orbitron typography for headings
- Smooth scroll and Framer Motion animations
- Ambient lighting effects and glow accents
- Performance-focused aesthetic with red/gold/blue accents

## Author

**Tarcisse Ndjibu**
- GitHub: [@tarcisse22](https://github.com/tarcisse22)
- LinkedIn: [tarcisse-ndjibu](https://linkedin.com/in/tarcisse-ndjibu-5a0438294)
