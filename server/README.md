# StayEase — Backend API

Express.js + MongoDB backend for the StayEase hotel booking system (Deliverable 2).

## Tech Stack
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs (password hashing)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string (local `mongodb://127.0.0.1:27017/stayease`
     or a free MongoDB Atlas cluster URI)
   - `JWT_SECRET` — any long random string

3. Seed the database with room data (matches the frontend's mock data):
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get current logged-in user |

### Rooms
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/rooms` | Public | List rooms (supports `?type=` and `?search=`) |
| GET | `/api/rooms/:id` | Public | Get a single room |
| POST | `/api/rooms` | Admin | Create a room |
| PUT | `/api/rooms/:id` | Admin | Update a room |
| DELETE | `/api/rooms/:id` | Admin | Delete a room |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Private | Create a booking |
| GET | `/api/bookings/my` | Private | Get logged-in user's bookings |
| GET | `/api/bookings` | Admin | Get all bookings |
| PUT | `/api/bookings/:id/status` | Admin | Update booking status |

## Connecting to the Frontend

In the StayEase frontend, replace `src/data/rooms.js` calls with `axios`/`fetch`
requests to these endpoints (e.g. `GET http://localhost:5000/api/rooms`), and
store the JWT token returned from login/register (e.g. in the Pinia store) to
send as a `Bearer` token on protected requests.
