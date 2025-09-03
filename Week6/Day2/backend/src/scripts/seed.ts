import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';
import * as bcrypt from 'bcrypt';

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecom';
  await connect(uri);
  const mongoose = await import('mongoose');
  try {
    const UserModel = mongoose.model('User');
    const existing = await UserModel.findOne({ email: process.env.SUPERADMIN_EMAIL || 'admin@example.com' });
    if (!existing) {
      const hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'SuperSecret123', 10);
      await UserModel.create({ email: process.env.SUPERADMIN_EMAIL || 'admin@example.com', name: 'Super Admin', passwordHash: hash, role: 'super_admin', loyaltyPoints: 0, verified: true });
      console.log('Super admin created');
    } else {
      console.log('Super admin exists');
    }
  } catch (e) {
    console.log('Make sure models are registered by running the app at least once or seed after app start.');
  }

  process.exit(0);
}

seed();
