# Auction Backend (NestJS) - Minimal Functional Version

This is a minimal NestJS backend implementing the core features you requested:
- JWT authentication (register/login)
- Users, Cars (auctions), Bids, Notifications
- Real-time Socket.IO gateway for live bids (join auction rooms)
- Server-side validation for bidding rules

## Quick start
1. Copy `.env.sample` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. `npm i`
3. `npm run start:dev` (development; requires `ts-node`)

Server listens on port specified in `.env` or default 5000.

## Notes
- Photos are accepted as URLs in `photos` array; Cloudinary integration is left optional via `CLOUDINARY_URL`.
- Rate limiting provided via Nest Throttler.
- Postman collection included at `postman_collection.json`.

Socket usage:
- connect to socket.io at ws://localhost:5000
- emit `join` with `{ auctionId: '<carId>' }` to join room
- server emits `newBid` to room on new bids
