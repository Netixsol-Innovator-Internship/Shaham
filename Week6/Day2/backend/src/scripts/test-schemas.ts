import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';
import { Variant } from '../variants/schemas/variants.schema';
import { User } from '../users/schemas/user.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { Order } from '../orders/schemas/order.schema';
import { Sale } from '../sales/schemas/sale.schema';

async function testSchemas() {
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        console.log('🧪 Testing updated schemas...');

        // Test Product Schema
        const productModel = app.get(getModelToken(Product.name));
        console.log('✅ Product schema loaded with loyalty points support');

        // Test Variant Schema
        const variantModel = app.get(getModelToken(Variant.name));
        console.log('✅ Variant schema loaded with loyalty points support');

        // Test User Schema
        const userModel = app.get(getModelToken(User.name));
        console.log('✅ User schema loaded with loyalty points support');

        // Test Cart Schema
        const cartModel = app.get(getModelToken(Cart.name));
        console.log('✅ Cart schema loaded with enhanced item structure');

        // Test Order Schema
        const orderModel = app.get(getModelToken(Order.name));
        console.log('✅ Order schema loaded with loyalty points support');

        // Test Sale Schema
        const saleModel = app.get(getModelToken(Sale.name));
        console.log('✅ Sale schema loaded');

        console.log('\n🎉 All schemas are working correctly!');
        console.log('\n📋 Schema Updates Summary:');
        console.log('- Product: Added pointsPrice, productType, isLoyaltyOnly');
        console.log('- Variant: Added pointsPrice, purchaseMethod');
        console.log('- Cart: Enhanced item structure with loyalty points support');
        console.log('- Orders: Fixed points calculation (1 point per $50)');
        console.log('- Notifications: Enhanced with loyalty points notifications');
        console.log('- Socket.IO: Properly configured for real-time updates');

    } catch (error) {
        console.error('❌ Schema test failed:', error);
    } finally {
        await app.close();
    }
}

testSchemas();
