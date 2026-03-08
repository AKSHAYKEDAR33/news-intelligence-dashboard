# News Intelligence Dashboard

A multi-page React app that fetches live news headlines, lets you search by keyword/category, and manage news alerts — all persisted in `db.json` via JSON Server.

## Tech Stack
- **React + Vite** — frontend framework
- **React Router DOM** — multi-page routing
- **Axios** — HTTP requests
- **NewsAPI** — live news data
- **Local Auth (JSON Server)** — signup/login with password hashing
- **JSON Server** — mock REST backend (stores data in `db.json`)
- **Concurrently** — runs both servers at once

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a free API key
Go to [https://newsapi.org](https://newsapi.org) → sign up → copy your API key.

### 3. Add your API key
Open the `.env` file and replace the placeholder:
```
VITE_NEWS_API_KEY=paste_your_key_here
```

### 4. Run the project
```bash
npm run dev
```

This starts:
- React app at **http://localhost:5173**
- JSON Server at **http://localhost:5000**

## Pages
| Page | Path | What it does |
|------|------|-------------|
| Auth Home | `/` | Signup/Login using JSON Server data in `db.json` |
| Dashboard Home | `/` (after login) | Shows US top headlines and interest filtering |
| Search | `/search` | Search by keyword + category, saves to db.json |
| Alerts | `/alerts` | Create/delete alerts, stored in db.json |

## Auth storage details
- Users are stored under `users` in `db.json`.
- Passwords are not stored in plain text.
- Password hashing uses SHA-256 with:
  - random per-user salt
  - multiple iterations (hash stretching)
  - app-level pepper constant

This is acceptable for learning/demo projects, but for production use a secure backend auth provider.

## Project Structure
```
src/
  components/   Navbar, NewsTable, AlertTable
  pages/        HomePage, SearchPage, AlertsPage
  hooks/        useTopHeadlines, useSearchNews
  services/     newsApi.js, jsonServerApi.js
db.json         ← form data is stored here
.env            ← your API key (never commit this)
```

## Git Setup
```bash
git init
git add .
git commit -m "Initial commit: News Intelligence Dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/news-intelligence-dashboard.git
git push -u origin main
```
