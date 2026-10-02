# Meeting Room Booking System

A full-stack web application designed to help teams effectively manage and book meeting rooms. Built with a modern Next.js frontend and an Express + Sequelize backend, the system guarantees conflict-free bookings, role-based room administration, and a highly responsive, premium user interface.

## Features

- **Authentication System:** Secure JWT-based authentication using HttpOnly cookies for robust security against XSS.
- **Room Management:** Users can create meeting rooms, invite others, and assign permissions. Room creators automatically gain the `ADMIN` role, allowing them to edit room details and manage members.
- **Smart Booking System:** Real-time overlap and conflict resolution logic. Validates meeting start times dynamically (with a leniency period for currently ongoing meetings to allow real-time description updates).
- **Interactive UI:** Dynamic UI featuring optimistic updates via RTK Query, detailed error handling, accessibility-ready modal focus traps, and interactive empty states.
- **Responsive Design:** Mobile-friendly layouts powered by Tailwind CSS.

## Tech Stack

**Frontend:**
- **Framework:** Next.js (App Router)
- **State Management:** Redux Toolkit & RTK Query
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Forms & Validation:** React Hook Form with Zod schema validation

**Backend:**
- **Framework:** Node.js with Express
- **Database ORM:** Sequelize
- **Database Engine:** PostgreSQL
- **Security:** bcryptjs (password hashing), jsonwebtoken (JWT validation)

## Folder Structure

```text
meeting-room-booking/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Database instances and configuration
│   │   ├── controllers/      # Express route controllers
│   │   ├── errors/           # Custom error handler classes
│   │   ├── middleware/       # JWT Auth and global Error catching
│   │   ├── migrations/       # Database schematic migrations
│   │   ├── models/           # Sequelize ORM schema definitions 
│   │   ├── routes/           # Endpoint definitions
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── scripts/          # Manual testing and DB seeding utilities
│   │   ├── services/         # Core DB logic & operations
│   │   ├── types/            # TypeScript module augmentation
│   │   └── utils/            # Role and API utilities
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # Reusable UI Blocks (Inputs, Modals, Buttons)
│   │   ├── lib/              # Utility functions and Zod schemas
│   │   ├── providers/        # Redux and other Context wrappers
│   │   ├── store/            # Redux Slices & RTK Query API structure
│   │   └── types/            # Frontend global TypeScript definitions
```

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Database Configuration (Backend)
Navigate to the `backend` folder and configure your environment variables:
```bash
cd backend
cp .env.example .env
```
Update `.env` with your PostgreSQL credentials (specifically `DATABASE_URL` or fallback to individual DB env configurations).

Install dependencies and boot up the server:
```bash
npm install
npm run build
npm run start
# For development w/ hot-reload: npm run dev
```

### 2. Frontend Configuration
In a separate terminal block, navigate to the `frontend` folder:
```bash
cd frontend
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL` correctly points to your backend instance (e.g., `http://localhost:5000/api`).

Install frontend dependencies and start the app:
```bash
npm install
npm run dev
```
The client application will automatically mount to `http://localhost:3000`.

## Post-Deployment Security Notes
- **Cookie Domains:** For deployed production environments where the frontend and backend live on entirely different origins (e.g. `client.site.com` and `api.site.com`), ensure proper `Access-Control-Allow-Credentials` headers are enabled in backend `cors()`, and update `cookie` options to map perfectly to your base domain. 

## License
This project is open source and freely available under the [MIT License](LICENSE).
