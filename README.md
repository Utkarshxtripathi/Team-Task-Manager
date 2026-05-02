# Team Task Manager

A professional-grade "Dark SaaS" MERN stack application for teams to manage tasks, projects, and productivity with real-time updates and analytics.

## Features
- **Authentication**: JWT-based secure signup and login.
- **Role-Based Access Control**: Admins can invite/remove members and create tasks. Assignees can update their task statuses.
- **Projects**: Create projects and manage a dedicated team for each.
- **Tasks**: Kanban-style Task Board with filtering (Status, Priority, Assignee).
- **Dashboard Analytics**: Visual representations using Recharts (Task distributions, pipeline overview).
- **Dark SaaS UI**: Glassmorphic modals, smooth micro-interactions, responsive design, and global toast notifications.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Recharts, React Hot Toast, React Router DOM.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT).

## Local Development Setup

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory based on `.env.example`.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Deployment
This project is configured for easy deployment on platforms like Railway or Render. 
- The **Backend** root is `/server`.
- The **Frontend** root is `/client` (Build command: `npm run build`, Output: `dist`).
- Ensure `VITE_API_URL` is set in the frontend environment to point to your live API.
