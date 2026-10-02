# Project Camp — Frontend

React + Vite frontend for the Project Camp backend, built to match:
- `Project_Management_Frontend_PRD_v1_0_0.pdf`
- `Project_Camp_Backend_PRD.pdf`

## Setup

```bash
cd frontend
npm install
```

Edit `.env` if your backend runs somewhere other than `http://localhost:8000`:

```
VITE_API_URL=http://localhost:8000/api/v1
```

Then run:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Make sure your backend is running and
that its CORS config allows `http://localhost:5173` with credentials.

## Structure

```
src/
├── components/   # Reusable UI: Navbar, Sidebar, cards, badges, Modal, etc.
├── pages/        # One file per route (Login, Dashboard, ProjectDetails, ...)
├── services/     # One file per backend resource — all API calls live here
├── context/      # AuthContext — tracks the logged-in user app-wide
├── hooks/        # useAuth() — convenience hook to read AuthContext
├── App.jsx       # All routes, matching the PRD's route table
└── main.jsx      # Entry point (BrowserRouter + AuthProvider)
```

## Notes on a few implementation choices

- **Token storage**: access token in `localStorage`, refresh token assumed to be
  an httpOnly cookie (backend sets it on login) — `withCredentials: true` in
  `services/api.js` sends it automatically. A 401 triggers one silent
  `/auth/refresh-token` call before falling back to logging the user out.
- **`/tasks` (global "My Tasks")**: the backend only exposes tasks *per project*
  (`GET /tasks/:projectId`), so this page fetches the user's projects first,
  then fetches each project's tasks in parallel and merges them.
- **`/tasks/:taskId`**: same issue — the backend needs a `projectId` to look up
  a task. We pass `projectId` via router state when navigating from a task
  card; if the page loads directly (e.g. a refresh or shared link), it falls
  back to searching the user's projects for that task ID.
- **Notes**: scoped per project on the backend, so the Notes page has a
  project picker at the top.
- **Role-based UI**: buttons like Edit/Delete Project, Add/Remove Member, and
  Add/Delete Note are hidden unless the current user's role allows it — but
  this is UI-only. The backend is still the real authority and will reject
  unauthorized requests regardless.
