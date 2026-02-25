import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  createdAt: { type: String, required: true },
  customer: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
  },
  story: {
    longText: String,
    highlights: [String],
    periods: [String],
    locations: [String],
    isFiction: Boolean,
    themes: [String],
  },
  characters: [{
    id: String,
    name: String,
    gender: String,
    age: String,
    physical: String,
    personality: String,
    hair: String,
    eyes: String,
    photos: [String],
  }],
  status: { type: String, default: 'received' },
  paymentStatus: { type: String, default: 'unpaid' },
  adminNote: String,
  photo_paths: [String],
});

const OrderModel = mongoose.models.Order || mongoose.model<Order & Document>('Order', OrderSchema);

export const OrderRepository = {
  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>): Promise<Order> {
    const order = new OrderModel({
      ...orderData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'received',
      paymentStatus: 'unpaid',
    });

    await order.save();
    return order.toObject() as Order;
  },

  async getById(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({ id }).lean();
    return order as Order | null;
  },

  async getAll(): Promise<Order[]> {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return orders as Order[];
  },

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const order = await OrderModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    ).lean();
    return order as Order | null;
  }
};
