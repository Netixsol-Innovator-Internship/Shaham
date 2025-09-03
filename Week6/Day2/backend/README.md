# Ecommerce Backend (Full) - NestJS Scaffold

This expanded repository includes:
- Cloudinary image upload (uses cloud name, api key, secret from env)
- Stripe PaymentIntent creation + checkout verification
- Persisted Notifications in MongoDB + Socket.IO gateway
- Expanded Postman collection covering many endpoints
- Basic validation DTOs and improved error handling
- Jest test config and a sample test

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Start dev server: `npm run start:dev`
4. Seed SUPER_ADMIN: `npm run seed`
5. Import `postman_collection_full.json` into Postman

Notes:
- Cloudinary credentials: supply `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Stripe: supply `STRIPE_SECRET_KEY` (test key for development).
- For production, use MongoDB replica set for transactions.
