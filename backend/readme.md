# StayMate - Hotel Booking System

StayMate is a hotel booking system that allows users to book rooms, manage bookings, make payments, and leave reviews. It supports user roles such as Customer, Admin, and Hotel Owner, and facilitates easy management of hotels, rooms, and bookings.

## Features

- User management (Customers, Admin, and Hotel Owners)
- Hotel and room management
- Booking management (create, view, update, delete bookings)
- Payment integration (CREDIT_CARD, PAYPAL, STRIPE)
- Review system for hotels and rooms
- Notifications for booking confirmations and payment success

## Requirements

- Java 8 or higher
- MySQL (or compatible) database
- Maven 3.6+ for building and managing dependencies

## Setup

### 1. Clone the repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/your-username/staymate.git
cd staymate/backend
```

### 2. Install dependencies

Make sure Maven is installed on your machine. You can download and install Maven from [here](https://maven.apache.org/download.cgi).

Once Maven is installed, run the following command to install the dependencies:

```bash
mvn install
```

### 3. Configure the database

Make sure you have a MySQL database running. You'll need to create a `database-config.properties` file in the `src/main/resources` directory with the following configuration:

```properties
db.url=jdbc:mysql://localhost:3306/staymatedb
db.username=<username>
db.password=<password>
db.driver=com.mysql.cj.jdbc.Driver
```

Adjust the values based on your MySQL setup.

### 4. Create the database schema

You can run the `DatabaseScriptRunner` class to initialize the database schema:

```bash
mvn exec:java
```

This will create the necessary tables and indexes in your database.

### 5. Run the application

To run the application, use the following Maven command:

```bash
mvn spring-boot:run
```

This will start the application on the default port (8080). You can visit `http://localhost:8080` to access the application.

## Database Schema

The following tables are created for the application:

- `User` - Stores user details (id, first name, last name, email, password, etc.)
- `Hotel` - Stores hotel details (id, name, address, latitude, longitude, etc.)
- `Room` - Stores room details (id, room type, price, status, etc.)
- `Booking` - Stores booking information (check-in/out dates, status, etc.)
- `Review` - Stores reviews for hotels and rooms (rating, comment, etc.)
- `Payment` - Stores payment information (method, amount, transaction date, etc.)
- `Notification` - Stores notifications for users (message, type, status, etc.)
