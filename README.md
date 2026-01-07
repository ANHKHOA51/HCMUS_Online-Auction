# HCMUS Online Auction Platform

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Common Issues](#common-issues)
- [Contact](#contact)

---

## Overview
This is an online auction platform for HCMUS, supporting user registration, product listing, bidding, proxy bidding, and admin management. The project includes a PostgreSQL database, Node.js backend, and React frontend.

## Tech Stack
- **Database:** PostgreSQL
- **Backend:** Node.js (Express)
- **Frontend:** React (Vite)

## Project Structure
```
HCMUS_Online-Auction/
├── backend/        # Node.js API server
├── frontend/       # React client app
├── db/             # SQL schema, seed, migration files
├── script.sql      # Reference DB schema
└── README.md       # This file
```

## Setup Instructions

### 1. Database Setup
1. **Install PostgreSQL**
   - macOS: `brew install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
2. **Create Database**
   ```sh
   createdb auction_db
   ```
3. **Run Schema & Seed Scripts**
   ```sh
   psql -d auction_db -f db/01_schema.sql
   psql -d auction_db -f db/02_indexes.sql
   psql -d auction_db -f db/03_functions.sql
   psql -d auction_db -f db/04_seed.sql
   ```
   - Optionally, use `script.sql` for reference.
4. **Configure DB Connection**
   - Update `backend/utils/db.js` with your DB credentials if needed.

### 2. Backend Setup
1. **Install Node.js & npm**
   - macOS: `brew install node`
   - Windows: Download from [nodejs.org](https://nodejs.org/)
2. **Install Dependencies**
   ```sh
   cd backend
   npm install
   ```
3. **Configure Environment**
   - Create `.env` file in `backend/` (if needed):
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=youruser
     DB_PASSWORD=yourpassword
     DB_NAME=auction_db
     JWT_SECRET=your_jwt_secret
     ```
4. **Run Backend Server**
   ```sh
   node index.js
   ```
   - Or use: `npm start` if available.

### 3. Frontend Setup
1. **Install Dependencies**
   ```sh
   cd frontend
   npm install
   ```
2. **Run Frontend (Vite)**
   ```sh
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173)
3. **Configure API Endpoint**
   - If needed, update API URLs in `frontend/src/services/` to match backend address.

## Common Issues
- **Database Connection Errors:**
  - Check DB credentials in `.env` and `backend/utils/db.js`.
  - Ensure PostgreSQL is running: `pg_ctl -D /usr/local/var/postgres start`
- **Port Conflicts:**
  - Change frontend/backend ports in config files if needed.
- **Missing Dependencies:**
  - Run `npm install` in both `backend` and `frontend` folders.
- **CORS Issues:**
  - Backend should allow requests from frontend origin (see Express CORS middleware).

## Contact
- For questions, contact project maintainer or open an issue on GitHub.

---
