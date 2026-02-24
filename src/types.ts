export type OrderStatus = 'received' | 'preparing' | 'in_production' | 'shipped' | 'delivered';
export type PaymentStatus = 'unpaid' | 'pending_review' | 'paid';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface StoryInfo {
  longText: string;
  highlights: string[];
  periods: string[];
  locations: string[];
  isFiction: boolean;
  themes: string[];
}

export interface CharacterInfo {
  id: string;
  name: string;
  gender: string;
  age: string;
  physical: string;
  personality: string;
  hair: string;
  eyes: string;
  photos: string[]; // Placeholder for photo names/URLs
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  story: StoryInfo;
  characters: CharacterInfo[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  adminNote?: string;
  photo_paths?: string[];
}
