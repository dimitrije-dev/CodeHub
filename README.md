# CodeHub - Full Stack Developer Productivity App

![CodeHub Dashboard](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.11.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-blue)

## Overview

CodeHub is a modern full-stack application designed to boost developer productivity. It combines task management, code snippet storage, Pomodoro timer, and an achievement system into one comprehensive platform.

## Features

### Task Management
- Create and manage tasks with priorities (low, medium, high)
- Status tracking (To-Do, Doing, Done)
- Due date management with calendar view
- Filtering and search by status and priority
- Real-time updates with drag and drop functionality

### Code Snippets
- Syntax highlighting for 8+ programming languages
- Organization by categories (JavaScript, TypeScript, Python, Java, C#, HTML, CSS, SQL)
- Quick search and filtering
- Copy-to-clipboard functionality
- Version control for snippets

### Pomodoro Timer
- Customizable timer (25min work, 5min break)
- Session tracking with statistics
- Focus time analytics with charts
- Break reminders with notifications
- Productivity insights

### Achievement System
- 12 unique achievements for motivation
- Progress tracking with percentages
- Real-time unlock notifications
- Gamification elements for engagement

### Analytics Dashboard
- Focus time charts (7-day view)
- Task completion velocity
- Productivity metrics
- Personal statistics
- Interactive calendar

## Technologies

### Frontend
- React 18.2.0 - Modern UI library
- Vite - Fast build tool
- React Router - Client-side routing
- Recharts - Data visualization
- React Syntax Highlighter - Code display
- CSS3 - Custom styling system

### Backend
- Node.js 20.11.0 - Runtime environment
- Express.js - Web framework
- PostgreSQL 14 - Relational database
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Running
```bash
npm run dev
```

Application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 3. Database Setup
```bash
cd server
node scripts/setup-db.js
```

## Usage

1. Registration - Create a new account
2. Login - Sign in to your account
3. Dashboard - View productivity metrics
4. Tasks - Manage your tasks
5. Snippets - Save code snippets
6. Pomodoro - Focus on work sessions

## Screenshots

### Dashboard
- Interactive focus time chart
- Task statistics
- Achievement system
- Calendar view

### Task Management
- Drag and drop interface
- Priority system
- Status tracking
- Due date management

### Code Snippets
- Syntax highlighting
- Language categorization
- Search functionality
- Edit/Delete options

## Development

### Project Structure
```
codehub-fullstack/
├── server/                 # Backend API
│   ├── controllers/        # Route handlers
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation
│   └── scripts/           # Database setup
├── codehub-react/         # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API calls
│   │   └── styles/        # CSS files
│   └── public/            # Static assets
└── package.json           # Root dependencies
```

### Scripts
```bash
npm run dev          # Run both servers
npm run dev:server   # Backend only
npm run dev:client   # Frontend only
npm run build        # Production build
```

## Database Schema

### Users
- id, username, email, password_hash, created_at

### Tasks
- id, user_id, title, description, priority, status, due_date, created_at, updated_at

### Snippets
- id, user_id, title, language, code, created_at, updated_at

### Focus Sessions
- id, user_id, duration_minutes, created_at

## Deployment

### Production Build
```bash
# Frontend
cd codehub-react
npm run build

# Backend
cd ../server
npm start
```

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-secret
PORT=3001
```


## License

MIT License - see LICENSE file for details

## Author

**Dimitrije Milenkovic**
- GitHub: [@dimitrijemilenkovic](https://github.com/dimitrijemilenkovic)

---

If you like this project, please give it a star!
