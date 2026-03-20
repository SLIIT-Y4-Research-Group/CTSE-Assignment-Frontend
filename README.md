# EventHub Frontend

Modern React (Vite) + Tailwind CSS frontend for the EventHub Event Management System.

## Features
- Public pages: Home, Events, Tickets
- Auth: Login, Register, forced password change modal
- Admin dashboard: Users + Roles management
- Non-admin dashboard: Overview + Profile
- JWT stored in localStorage and attached to API calls

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

## Environment
Set your backend URL in `src/api/client.js` if needed (currently empty baseURL).

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`
- `POST /api/users/me/change-password`

### Roles
- `GET /api/roles`
- `POST /api/roles`
- `PATCH /api/roles/:id`
- `DELETE /api/roles/:id`

## Notes
- Users list requires `users:read` permission.
- Admin role is recognized by role name `admin`.

## License
MIT
