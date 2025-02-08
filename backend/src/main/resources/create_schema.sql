CREATE SCHEMA IF NOT EXISTS staymatedb;

USE staymatedb;

CREATE TABLE IF NOT EXISTS User (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15), -- Optional phone number, adjust length as needed
    role ENUM('CUSTOMER', 'ADMIN', 'HOTEL_OWNER') NOT NULL,  -- Enum values for user roles
    CONSTRAINT email_unique UNIQUE (email) -- Ensure email is unique
);

CREATE TABLE IF NOT EXISTS Hotel (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,  -- Changed to DECIMAL for precision
    longitude DECIMAL(9, 6) NOT NULL, -- Changed to DECIMAL for precision
    owner_id BIGINT,
    FOREIGN KEY (owner_id) REFERENCES User(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT,
    room_type VARCHAR(255) NOT NULL, -- SINGLE, DOUBLE, SUITE
    price_per_night DOUBLE NOT NULL,
    max_occupancy INT NOT NULL,
    status ENUM('AVAILABLE', 'UNAVAILABLE', 'BOOKED') NOT NULL, -- Use ENUM for status
    FOREIGN KEY (hotel_id) REFERENCES Hotel(id)
);

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
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Room(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT, -- Foreign Key reference to User table
    hotel_id BIGINT, -- Foreign Key reference to Hotel table
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(id)
);

CREATE TABLE IF NOT EXISTS Payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    payment_method ENUM('CREDIT_CARD', 'PAYPAL', 'STRIPE') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL, -- Payment status
    FOREIGN KEY (booking_id) REFERENCES Booking(id)
);

CREATE TABLE IF NOT EXISTS Notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message VARCHAR(255) NOT NULL, 
    type ENUM('BOOKING_CONFIRMATION', 'PAYMENT_SUCCESS') NOT NULL,  -- Notification type (using ENUM)
    is_read BOOLEAN NOT NULL, 
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id)
);