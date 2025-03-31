export interface LoginData {
    email: string;
    password: string;
    role: "customer" | "admin";
  }
  
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
  }

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "CUSTOMER" | "ADMIN";
}