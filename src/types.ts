export interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

export interface Ingredient {
  name: string;
  origin?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Drinks';
  image: string;
  nutritionalInfo?: {
    calories: number;
    protein: string;
    fat: string;
  };
  allergens?: string[];
  reviews?: Review[];
  ingredients?: Ingredient[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  tableNumber?: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: string;
  confirmationCode: string;
  tableNumber?: string;
}
