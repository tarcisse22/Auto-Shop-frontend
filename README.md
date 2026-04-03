# Auto Shop Inventory Manager

A full-stack web application for managing auto service shop inventory. Built with React and Firebase, it enables shop staff to track vehicles, manage service records, and handle inventory in real time.

## Features

- **Authentication** — Secure login and registration via Firebase Auth with role-based access control
- **Vehicle Management** — Add, edit, view, and delete vehicle records with full CRUD functionality
- **Real-Time Updates** — Live data sync powered by Firestore; changes reflect instantly across sessions
- **Responsive Design** — Clean, mobile-friendly UI that works across desktop and mobile devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend / Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Styling | CSS3 |
| Package Manager | npm |

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/tarcisse22/Auto-Shop-frontend.git
cd Auto-Shop-frontend

# Install dependencies
npm install
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Firestore Database** and **Authentication** (Email/Password)
3. Copy your Firebase config and create a `.env` file in the root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
Auto-Shop-frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── firebase.js       # Firebase initialization and config
│   └── main.jsx          # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## Author

**Tarcisse Ndjibu**
- GitHub: [@tarcisse22](https://github.com/tarcisse22)
- LinkedIn: [tarcisse-ndjibu](https://linkedin.com/in/tarcisse-ndjibu-5a0438294)
