import Database from 'better-sqlite3';
import { Order } from '../types';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('manga_orders.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    createdAt TEXT,
    data TEXT
  )
`);

export const OrderRepository = {
  create(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>): Order {
    const order: Order = {
      ...orderData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'received',
      paymentStatus: 'unpaid',
    };

    const stmt = db.prepare('INSERT INTO orders (id, createdAt, data) VALUES (?, ?, ?)');
    stmt.run(order.id, order.createdAt, JSON.stringify(order));
    
    return order;
  },

  getById(id: string): Order | null {
    const stmt = db.prepare('SELECT data FROM orders WHERE id = ?');
    const row = stmt.get(id) as { data: string } | undefined;
    return row ? JSON.parse(row.data) : null;
  },

  getAll(): Order[] {
    const stmt = db.prepare('SELECT data FROM orders ORDER BY createdAt DESC');
    const rows = stmt.all() as { data: string }[];
    return rows.map(row => JSON.parse(row.data));
  },

  update(id: string, updates: Partial<Order>): Order | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const stmt = db.prepare('UPDATE orders SET data = ? WHERE id = ?');
    stmt.run(JSON.stringify(updated), id);
    
    return updated;
  }
};
