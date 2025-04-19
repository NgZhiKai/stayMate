# StayMate - Hotel Booking System

StayMate is a hotel booking system that allows users to book rooms, manage bookings, make payments, and leave reviews. It supports user roles such as Customer, Admin, and Hotel Owner, and facilitates easy management of hotels, rooms, and bookings.

## Features

- **User Management**: Handle customers, admins, and hotel owners
- **Hotel and Room Management**: Create, update, and manage hotels and rooms
- **Booking Management**: Create, view, update, and delete bookings
- **Payment Integration**: Support for **CREDIT_CARD**, **PAYPAL**, and **STRIPE** payments
- **Review System**: Users can leave reviews for hotels and rooms
- **Notifications**: Users receive notifications for booking confirmations and payment success

## Project Structure

The project consists of two main parts:

1. **Frontend**: A React-based user interface for booking hotels, managing bookings, and user interactions.
2. **Backend**: A Spring Boot application that handles user management, booking management, payments, reviews, and other server-side operations.

## Frontend

The frontend is built with **React** and **TypeScript**. For setup instructions and more details, refer to the [Frontend README](frontend/README.md).

## Backend

The backend is built with **Java 8+** and **Spring Boot**. For setup instructions and more details, refer to the [Backend README](backend/README.md).

## Requirements

- **Java 17+** for the backend
- **Node.js** and **npm** for the frontend
- **MySQL** (or compatible) database for storing data
- **Maven 3.6+** for building the backend
- **Docker** (optional) for containerization

## Setup

### 1. Clone the repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/your-username/staymate.git
cd staymate
```

### 2. Setup the Backend

For detailed backend setup instructions, navigate to the [backend README](backend/README.md).

### 3. Setup the Frontend

For detailed frontend setup instructions, navigate to the [frontend README](frontend/README.md).

## Running the Application

- The frontend will be available at `http://localhost:5173` (or another port if specified).
- The backend will be available at `http://localhost:4200` (or another port if specified).

## Testing

The backend uses **JUnit** and **Mockito** for unit testing, and the frontend uses **Jest** for testing. To run all tests, use the following commands:

- Backend tests: `mvn test`
- Frontend tests: `npm test`
