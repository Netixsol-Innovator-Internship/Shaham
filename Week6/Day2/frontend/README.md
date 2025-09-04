# 🛍️ Ecommerce Frontend - Next.js with RTK Query & Socket.IO

A modern, fully-featured ecommerce frontend built with Next.js 14, Redux Toolkit Query, and Socket.IO for real-time notifications.

## ✨ Features

### 🎯 Core Ecommerce Features
- **Product Listings & Details** with beautiful UI
- **Shopping Cart** with real-time updates
- **Checkout System** supporting both money and loyalty points
- **Order History** and tracking
- **User Authentication** with OTP verification

### 🎁 Loyalty Points System
- **Points Display** in user profile
- **Hybrid Products** (money OR points)
- **Loyalty-Only Products** (points only)
- **Points Calculation** (1 point per $50 spent)
- **Real-time Points Updates**

### 🏷️ Sale System
- **Sale Banners** with countdown timers
- **Discounted Pricing** display
- **Sale Notifications** via Socket.IO
- **Active Sales** filtering

### 🔔 Real-time Notifications
- **Socket.IO Integration** for live updates
- **Sale Start Notifications**
- **Product Sold Out Alerts**
- **Loyalty Points Updates**
- **Order Status Changes**

### 👥 Role Management
- **User Dashboard** for shopping and points
- **Admin Panel** for product management
- **Super Admin** for full system control

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit + RTK Query
- **Real-time**: Socket.IO Client
- **Styling**: Tailwind CSS + Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── ...
├── components/             # Reusable UI components
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ...
├── store/                  # Redux store configuration
│   ├── api.ts             # RTK Query API
│   ├── store.ts           # Redux store
│   ├── authSlice.ts       # Authentication state
│   ├── cartSlice.ts       # Cart state
│   └── notificationSlice.ts # Notifications state
├── hooks/                  # Custom React hooks
│   └── useSocket.ts       # Socket.IO hook
├── types/                  # TypeScript type definitions
│   └── index.ts           # All app types
└── lib/                    # Utility functions
```

## 🔌 API Integration

### RTK Query Endpoints
- **Authentication**: Register, Login, OTP verification
- **Products**: List, details, filtering, loyalty products
- **Cart**: Add, update, remove items
- **Orders**: Create, checkout, history
- **Notifications**: Real-time updates

### Socket.IO Events
- `notifications:new` - New notification
- `sale:started` - Sale started
- `product:sold_out` - Product sold out
- `loyalty:points_updated` - Points balance update

## 🎨 UI Components

### Core Components
- **HeroSection** - Landing page hero
- **ProductGrid** - Product listings
- **ProductCard** - Individual product display
- **CartDrawer** - Shopping cart sidebar
- **NotificationBell** - Real-time notifications
- **LoyaltyPointsBanner** - Points display

### Form Components
- **LoginForm** - User authentication
- **RegisterForm** - User registration
- **OTPVerification** - Email verification
- **CheckoutForm** - Order completion

## 🔐 Authentication Flow

1. **User Registration** with email
2. **OTP Generation** and email delivery
3. **Email Verification** with 5-minute expiry
4. **Login** with verified credentials
5. **JWT Token** management
6. **Protected Routes** for authenticated users

## 🛒 Shopping Experience

### Product Discovery
- **Category Filtering** (t-shirts, shorts, shirts, hoodie, jeans)
- **Style Filtering** (casual, formal, party, gym)
- **Price Range** filtering
- **Search** functionality
- **Loyalty Points** product filtering

### Cart Management
- **Add Items** with variant selection
- **Quantity Updates** with real-time validation
- **Remove Items** with confirmation
- **Purchase Method** selection (money/points/hybrid)
- **Real-time Stock** checking

### Checkout Process
- **Address Collection** with validation
- **Payment Method** selection
- **Loyalty Points** redemption
- **Order Confirmation** with real-time updates

## 🔔 Notification System

### Real-time Features
- **Sale Start** notifications
- **Product Availability** alerts
- **Loyalty Points** earned/spent updates
- **Order Status** changes
- **Stock Updates** for cart items

### Notification Types
- **Toast Notifications** for immediate feedback
- **In-app Notifications** for persistent alerts
- **Email Notifications** for important updates
- **Push Notifications** (future enhancement)

## 📱 Responsive Design

- **Mobile First** approach
- **Responsive Grid** layouts
- **Touch-friendly** interactions
- **Optimized Images** for all devices
- **Progressive Web App** ready

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Tailwind CSS
- Custom color palette for brand consistency
- Responsive breakpoints
- Animation utilities
- Component classes

### Redux Store
- RTK Query for API management
- Persistent authentication state
- Real-time cart synchronization
- Notification state management

## 📊 Performance

- **Code Splitting** with Next.js
- **Image Optimization** with Next.js Image
- **Lazy Loading** for components
- **Memoization** for expensive operations
- **Bundle Analysis** with webpack-bundle-analyzer

## 🔒 Security

- **JWT Token** validation
- **Protected Routes** with middleware
- **Input Validation** with React Hook Form
- **XSS Protection** with proper sanitization
- **CSRF Protection** with token validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Next.js, Redux Toolkit, and Socket.IO**
