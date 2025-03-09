-- Create the schema and use it
CREATE SCHEMA IF NOT EXISTS staymatedb;

USE staymatedb;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Room;
DROP TABLE IF EXISTS Hotel;
DROP TABLE IF EXISTS Users;

-- Create User table
CREATE TABLE IF NOT EXISTS Users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15), -- Optional phone number, adjust length as needed
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL,  -- Enum values for user roles
    verification_token VARCHAR(255),
    verified BOOLEAN NOT NULL, 
    CONSTRAINT email_unique UNIQUE (email) -- Ensure email is unique
);

-- Create Hotel table
CREATE TABLE IF NOT EXISTS Hotel (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,  -- Changed to DECIMAL for precision
    longitude DECIMAL(9, 6) NOT NULL -- Changed to DECIMAL for precision
);

-- Create Room table
CREATE TABLE IF NOT EXISTS Room (
    hotel_id BIGINT,
    room_id BIGINT,
    room_type VARCHAR(255) NOT NULL,
    price_per_night DOUBLE NOT NULL,
    max_occupancy INT NOT NULL,
    status ENUM('AVAILABLE', 'UNAVAILABLE', 'BOOKED') NOT NULL,
    PRIMARY KEY (hotel_id, room_id),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(id)
);

-- Create Booking table
CREATE TABLE IF NOT EXISTS Booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_date DATE NOT NULL,
    total_amount DOUBLE NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id, room_id) REFERENCES Room(hotel_id, room_id)
);

-- Create Review table
CREATE TABLE IF NOT EXISTS Review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT, -- Foreign Key reference to User table
    hotel_id BIGINT, -- Foreign Key reference to Hotel table
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(id)
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS Payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    payment_method ENUM('CREDIT_CARD', 'PAYPAL', 'STRIPE') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL, -- Payment status
    FOREIGN KEY (booking_id) REFERENCES Booking(id)
);

-- Create Notification table
CREATE TABLE IF NOT EXISTS Notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message VARCHAR(255) NOT NULL, 
    type ENUM('BOOKING', 'PAYMENT', 'PROMOTION') NOT NULL,  -- Notification type (using ENUM)
    is_read BOOLEAN NOT NULL, 
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);