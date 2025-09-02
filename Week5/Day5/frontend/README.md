
# AutoBid Frontend (Next.js App Router + RTK Query + Tailwind)

This project implements the requirements you specified and is wired to the provided NestJS backend.

## Quick start

1. Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```
2. Install deps and run:
```
npm i
npm run dev
```

## Notes

- Login/register require **Terms** and **I'm not a robot** checkboxes (dummy) to be ticked.
- Social logins and Forgot password are dummy buttons.
- Landing page filters are disabled until login.
- Navbar includes a **profile icon** that goes to `/profile`. No profile image anywhere.
- Profile page shows only **Personal information** and **My Cars** with **Start auction**, **End auction**, and **Create my car** (opens form). The form uses **Min bid** and **Type** dropdown.
- Filters across pages are limited to **type**, **make**, **model**.
- Live auction card opens the auction detail page. When the server emits a `bidWinner` event including your userId and carId, you'll be navigated to `/payment/[carId]` where payment flow is **fake** and shows a 3-step progress.
- Bidding on your own car is prevented client-side; backend rule should also exist as per spec.

Images from the provided reference have been copied into `public/images/` (found 62 file(s)).
