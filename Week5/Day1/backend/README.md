# Realtime Comments Server (NestJS)

- Runs on port **5000**
- MongoDB via Mongoose
- Socket.IO namespace: `/comments`
- REST endpoints:
  - `GET /comments` – list latest 50
  - `POST /comments` – create a comment `{ authorId, text }`
- Emits `new_comment` to all clients on create.

## Env
Copy `.env.example` to `.env` and adjust values.

## Run
```bash
npm i
npm run start:dev
```
