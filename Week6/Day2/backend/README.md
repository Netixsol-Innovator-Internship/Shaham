# Ecommerce Backend (Full) - NestJS with Loyalty Points System

This expanded repository includes:
- **Complete Loyalty Points System** with hybrid product support
- **Enhanced Cart System** supporting money, points, and hybrid purchases
- **Real-time Notifications** via Socket.IO for sales and loyalty points
- **Cloudinary image upload** (uses cloud name, api key, secret from env)
- **Stripe PaymentIntent creation** + checkout verification
- **Persisted Notifications** in MongoDB + Socket.IO gateway
- **Expanded Postman collection** covering all endpoints including loyalty points
- **Basic validation DTOs** and improved error handling
- **Jest test config** and sample tests

## 🎯 New Features

### Loyalty Points System
- Users earn 1 point per $50 spent (configurable)
- Products can be: Regular (money only), Loyalty-only (points only), or Hybrid (both)
- Points validation during cart operations
- No delivery fees for points-only purchases

### Enhanced Cart Operations
- Support for variant-specific items (color, size, purchase method)
- Points balance validation
- Flexible purchase methods (money, points, hybrid)

### Real-time Notifications
- Sale start notifications
- Loyalty points earned/spent alerts
- Product availability updates
- Socket.IO integration

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Start dev server: `npm run start:dev`
4. Seed SUPER_ADMIN: `npm run seed`
5. Import `postman_collection.json` into Postman

## 🧪 Testing

```bash
# Test schema compilation
npm run test:schemas

# Test full compilation
npm run test:compilation

# Run Jest tests
npm test
```

## 📋 Environment Variables

Required environment variables:
- **MongoDB**: `MONGO_URI`
- **JWT**: `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Email**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Stripe**: `STRIPE_SECRET_KEY` (test key for development)

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - User registration with OTP
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/login` - User login

### Products
- `GET /products` - List products with filtering
- `GET /products/:id` - Get product details
- `POST /admin/products` - Create product (admin)
- `POST /admin/variants/:productId` - Create variant (admin)
- `POST /admin/sizes/:variantId` - Create size stock (admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart (supports points)
- `PATCH /cart/update/:productId` - Update cart item quantity
- `DELETE /cart/remove/:productId` - Remove item from cart

### Orders
- `POST /orders/create-payment-intent` - Create Stripe payment intent
- `POST /orders/checkout` - Checkout (supports points)
- `GET /orders` - User's order history
- `GET /orders/:id` - Get specific order

### Sales & Notifications
- `POST /admin/sales/create` - Create sale (admin)
- `GET /admin/sales/list` - List all sales
- `GET /notifications` - User notifications
- `POST /notifications/mark-read/:id` - Mark notification as read

## 🔧 Usage Examples

### Creating a Loyalty-Only Product
```typescript
// 1. Create product
const product = await fetch('/admin/products', {
  method: 'POST',
  body: JSON.stringify({
    name: "Premium T-Shirt",
    category: "t-shirts",
    productType: "loyalty-only",
    isLoyaltyOnly: true
  })
});

// 2. Create variant with points pricing
const variant = await fetch(`/admin/variants/${product.id}`, {
  method: 'POST',
  body: JSON.stringify({
    color: "blue",
    sku: "TSHIRT-BLUE-001",
    regularPrice: 0,
    pointsPrice: 100,
    purchaseMethod: "points"
  })
});

// 3. Add size stock
const sizeStock = await fetch(`/admin/sizes/${variant.id}`, {
  method: 'POST',
  body: JSON.stringify({
    size: "medium",
    stock: 10
  })
});
```

### Adding Points Item to Cart
```typescript
await fetch('/cart/add', {
  method: 'POST',
  body: JSON.stringify({
    productId: "product_id",
    variantId: "variant_id",
    sizeStockId: "size_stock_id",
    qty: 1,
    purchaseMethod: "points"
  })
});
```

### Checking Out with Points
```typescript
await fetch('/orders/checkout', {
  method: 'POST',
  body: JSON.stringify({
    purchaseMethod: "points",
    address: {
      street: "123 Main St",
      city: "City",
      state: "State",
      zip: "12345"
    }
  })
});
```

## 📊 Points System Details

- **Earning Rate**: 1 point per $50 spent
- **Product Types**:
  - **Regular**: Money only (default)
  - **Loyalty-only**: Points only
  - **Hybrid**: Money OR points
- **Validation**: Server-side points balance checking
- **Notifications**: Real-time updates for points earned/spent

## 🔒 Security Features

- **OTP Verification**: 5-minute expiration with spam protection
- **Role-Based Access**: User, Admin, Super Admin roles
- **Points Validation**: Server-side balance checking
- **JWT Authentication**: Secure token-based auth

## 🎉 What's New

- ✅ Complete loyalty points system
- ✅ Hybrid product support
- ✅ Enhanced cart with variant management
- ✅ Real-time Socket.IO notifications
- ✅ Points-only checkout
- ✅ Enhanced Postman collection
- ✅ Comprehensive testing scripts

For production, use MongoDB replica set for transactions and proper environment variable management.
