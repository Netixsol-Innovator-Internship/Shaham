# Nest Realtime Comments Backend

Features:
- MongoDB via Mongoose
- JWT Auth (register/login)
- User profiles (username, email, bio, avatarUrl), followers/following
- Comments with nested replies (parentComment)
- Likes on comments
- Notifications (comment to all, reply to parent author only, like to comment author)
- WebSocket gateway (Socket.IO) for real-time notifications + UI updates

## Quick Start

```bash
cp .env.example .env
# edit .env
npm install
npm run start:dev
```

### REST Endpoints (high level)
- `POST /auth/register { username, email, password } -> { access_token }`
- `POST /auth/login { email, password } -> { access_token }`
- `GET /users/me` (Auth)
- `PATCH /users/me` (Auth) body: `{ username?, bio?, avatarUrl? }`
- `POST /users/:id/follow` (Auth) / `DELETE /users/:id/follow`
- `POST /comments` (Auth) body: `{ content, parentComment? }`
- `GET /comments?parent=<id|null>` (no parent param returns only root comments)
- `GET /comments/:id`
- `POST /comments/:id/like` (Auth)
- `DELETE /comments/:id/like` (Auth)
- `GET /notifications` (Auth)
- `PATCH /notifications/:id/read` (Auth)
- `PATCH /notifications/read-all` (Auth)

### WebSocket
Connect with Socket.IO:
```js
import { io } from "socket.io-client";
const socket = io(API_URL, { auth: { token: JWT } });
socket.on('notification:new', (n) => { /* render toast / badge */ });
socket.on('comments:new', (c) => { /* update comment list */ });
socket.on('comments:likes', (p) => { /* update likes counter */ });
```

### Vercel
This repo includes a `vercel.json` and an exported `handler` in `src/main.ts` using `@vendia/serverless-express`.
Build then deploy:
```bash
npm run build
vercel
```
> Note: Vercel WebSockets are supported, but ensure your project is on a plan/region that enables them. Alternatively consider a long-running host (Railway/Render) or a managed socket provider if needed.
