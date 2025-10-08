export interface User {
  id: string;
  phone: string;
  name?: string;
  isOnboarded: boolean;
  [key: string]: any; // optional: allows future fields
}