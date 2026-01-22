import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  roles: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  unitOfMeasure: string;
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  supplier: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
}

export interface Stock {
  id: number;
  productName: string;
  productType: string;
  batchNumber: string | null;
  quantityInStock: number;
  unitOfMeasure: string;
  alcoholByVolume: number;
  distillationDate: string | null;
  bottlingDate: string | null;
  agingPeriodMonths: number | null;
  barrelType: string | null;
  unitPrice: number;
  location: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
}

export interface Customer {
  id: number;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  customerType: string;
  taxId: string | null;
  licenseNumber: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  orderDate: string;
  shipDate: string | null;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  notes: string | null;
  shippingAddress: string | null;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  stockId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: any) => api.post<User>('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Ingredients API
export const ingredientsApi = {
  getAll: () => api.get<Ingredient[]>('/ingredients'),
  getById: (id: number) => api.get<Ingredient>(`/ingredients/${id}`),
  create: (data: any) => api.post<Ingredient>('/ingredients', data),
  update: (id: number, data: any) => api.put(`/ingredients/${id}`, data),
  delete: (id: number) => api.delete(`/ingredients/${id}`),
};

// Stocks API
export const stocksApi = {
  getAll: () => api.get<Stock[]>('/stocks'),
  getById: (id: number) => api.get<Stock>(`/stocks/${id}`),
  create: (data: any) => api.post<Stock>('/stocks', data),
  update: (id: number, data: any) => api.put(`/stocks/${id}`, data),
  delete: (id: number) => api.delete(`/stocks/${id}`),
};

// Customers API
export const customersApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (data: any) => api.post<Customer>('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: any) => api.post<Order>('/orders', data),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

export default api;

