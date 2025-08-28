
# Next.js 15 Realtime Comments (RTK Query + Tailwind + Socket.IO) — with Followers & Notifications

## Quick Start
```bash
cp .env.example .env
npm install
npm run dev
```

Set environment variables:
- `NEXT_PUBLIC_API_URL` — Nest API base (e.g. http://localhost:5000)
- `NEXT_PUBLIC_SOCKET_URL` — Socket.IO URL (same host as API)

## Backend endpoints expected
- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `GET /users/me`, `GET /users/:id`, `POST /users/:id/follow`, `POST /users/:id/unfollow`
- Comments: `GET /comments`, `GET /comments?parent=<id>`, `POST /comments`, `POST /comments/:id/like`, `DELETE /comments/:id/like`, `DELETE /comments/:id`
- Notifications: `GET /notifications`, `POST /notifications/read-all`
- Socket events: `comments:new`, `comments:likes`, `comments:deleted`, `notification`

## Notes
- JWT is stored in `localStorage` and added as `Authorization: Bearer <token>` by RTK Query.
- Socket handshake uses `auth: { token }` and reconnects when token changes.
- The Feed shows flat list as a threaded tree (one-level replies supported in UI).
