export interface User {
  id: string;
  phone: string;
  name?: string;
  isOnboarded: boolean;
  createdAt: string;
  [key: string]: any; // optional: allows future fields
}
