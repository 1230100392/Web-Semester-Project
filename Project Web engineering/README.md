# StayEase — Hotel Booking System (Client-Side Frontend)

Semester Project — Deliverable 1 (Client-Side Architecture)
University of Sialkot — BS Software Engineering

## Tech Stack
- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router 4 (SPA routing)
- Pinia (lightweight state management)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── assets/            # Global CSS design system
├── components/
│   ├── layout/         # NavBar, FooterBar
│   ├── rooms/           # RoomCard (props demo)
│   ├── booking/         # BookingForm (emits demo)
│   └── common/          # BaseButton, BaseAlert
├── data/                # Mock room data (placeholder for future API)
├── router/               # Vue Router route definitions
├── store/                # Pinia booking store
├── views/                 # Page-level components (routed)
│   ├── HomeView.vue
│   ├── RoomsView.vue
│   ├── RoomDetailsView.vue
│   ├── BookingView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── ContactView.vue
│   └── NotFoundView.vue
├── App.vue
└── main.js
```

## Routes

| Path             | View               | Description                     |
|------------------|--------------------|----------------------------------|
| `/`              | HomeView           | Landing page, featured rooms     |
| `/rooms`         | RoomsView          | Full room catalogue + filters    |
| `/rooms/:id`     | RoomDetailsView    | Single room details              |
| `/booking/:id`   | BookingView        | Booking form for a chosen room   |
| `/login`         | LoginView          | Mock login                       |
| `/register`      | RegisterView       | Mock registration                |
| `/contact`       | ContactView        | Contact form                     |
| `*`              | NotFoundView       | 404 fallback                     |

## Component Communication

- **Props**: `RoomCard.vue` receives a `room` object from parent views (`HomeView`, `RoomsView`)
  with a type validator enforcing required keys.
- **Emits**: `RoomCard.vue` emits `view-details`; `BookingForm.vue` emits `submit-booking`,
  handled by `BookingView.vue`.

## Notes

This deliverable covers the **client-side only**. Backend integration
(Express.js + MongoDB) will be implemented in a later phase — all data
currently comes from `src/data/rooms.js` as a mock source.
