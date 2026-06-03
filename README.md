# Customer-Support-Ticketing-CRM-System


A full-stack customer support ticketing system built with a React frontend and Node.js/Express backend. Features role-based access control, JWT authentication via HTTP-only cookies, and a clean responsive UI.

---

##🌐Live Links
**Live-Application** https://crm-system-one-ebon.vercel.app/
**Backend API** https://crm-system-w656.onrender.com

## Tech Stack

**Frontend**
- React 19 + Vite 8
- React Router DOM v7
- Tailwind CSS v4
- Framer Motion
- Axios
- Lucide React

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- cookie-parser

---

## Features

- **Authentication** — Register, login, and logout with JWT stored in HTTP-only cookies
- **Role-based access** — `customer` and `admin` roles with enforced server-side permissions
- **Ticket management** — Create, view, search, and filter support tickets
- **Admin controls** — Update ticket status (`Open` / `In Progress` / `Closed`) and add internal notes
- **IDOR protection** — Customers can only access their own tickets
- **Responsive UI** — Mobile-first design with dark mode support

---

## Project Structure

```
├── datastraw-crm-backend/
│   ├── src/
│   │   ├── controllers/       # auth.controller.js, ticket.controller.js
│   │   ├── db/                # MongoDB connection
│   │   ├── middlewares/       # verifyJWT, verifyAdmin
│   │   ├── models/            # User, Ticket, Note schemas
│   │   ├── routes/            # auth.route.js, ticket.route.js
│   │   └── utils/             # ApiError, ApiResponse, AsyncHandler
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/               # Axios instance
    │   ├── components/        # Navbar, Badge, Button, Card
    │   ├── context/           # AuthContext, ThemeContext
    │   └── pages/             # Login, Dashboard, CreateTicket, TicketDetail
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Backend Setup

```bash
cd datastraw-crm-backend
npm install
```

Create a `.env` file in the `datastraw-crm-backend` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/datastraw
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the development server:

```bash
# With nodemon (recommended)
npx nodemon index.js

# Or plain Node
node index.js
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new customer account |
| POST | `/api/auth/login` | Public | Login and receive an access token cookie |
| POST | `/api/auth/logout` | JWT | Clear the access token cookie |
| GET | `/api/auth/me` | JWT | Get the currently authenticated user |

### Tickets

All ticket routes require a valid JWT (`verifyJWT` middleware).

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/tickets` | Any | Create a new ticket |
| GET | `/api/tickets` | Any | List tickets (customers see only their own) |
| GET | `/api/tickets/:ticket_id` | Any | Get ticket details + notes |
| PUT | `/api/tickets/:ticket_id` | Admin | Update status and/or add an internal note |

---

## Environment Variables

### Backend (`datastraw-crm-backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `FRONTEND_URL` | Allowed CORS origin (your frontend URL) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for all API requests |

---

## Creating an Admin User

New registrations are always assigned the `customer` role. To create an admin, manually update a user's role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Deployment

**Frontend** — Deploy to [Vercel](https://vercel.com). A `vercel.json` with SPA rewrites is already included.

**Backend** — Deploy to [Render](https://render.com), [Railway](https://railway.app), or any Node.js-compatible host. Set all environment variables in your hosting dashboard.

Remember to update `FRONTEND_URL` (backend) and `VITE_API_BASE_URL` (frontend) to your production URLs.

---

👨‍💻 Maintainer
Parth Vinod Jain - https://github.com/btwitssparth
