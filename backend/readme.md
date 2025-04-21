
# StayMate - Backend Setup

This is the backend part of the StayMate Hotel Booking System. It is built with **Java**, **Spring Boot**, and **MySQL**.

## Features

- User management (Customers, Admin, Hotel Owners)
- Hotel and room management
- Booking management (create, view, update, delete bookings)
- Payment integration (CREDIT_CARD, PAYPAL, STRIPE)
- Review system for hotels and rooms
- Notifications for booking confirmations and payment success

## Requirements

- **Java 17+**
- **MySQL** (or compatible) database
- **Maven 3.6+** for building and managing dependencies

## Setup

### 1. Clone the Repository

Clone the repository to your local machine using Git:

```bash
cd staymate/backend
```
### 2. Install Dependencies

Make sure **Maven** is installed on your machine. You can download and install Maven from [here](https://maven.apache.org/download.cgi).

Once Maven is installed, run the following command to install the dependencies:

```bash
mvn clean install "-Dspring.profiles.active=dev"
```

### 3. Configure the Database

Make sure you have a **MySQL** (or compatible) database running. You'll need to create a `application.properties` file in the `src/main/resources` directory with the following configuration:

```properties
db.url=jdbc:mysql://localhost:3306/staymatedb
db.username=<username>
db.password=<password>
db.driver=com.mysql.cj.jdbc.Driver
``` 

Adjust the values based on your MySQL setup.


### 4. Run the Application

To run the application, use the following Maven command:
```bash
mvn spring-boot:run "-Dspring.profiles.active=dev"
```

This will start the application on the default port (**4200**). You can visit `http://localhost:4200` to access the application.

If you want to change the port, update the `application.properties` file:
```properties
server.port=4200
```
### 5. Run the Application in Development Mode

-   The backend will be available at `http://localhost:4200` (or another port if specified in `application.properties`).
## Database Schema

The following tables are created for the application:

-   **User**: Stores user details (id, first name, last name, email, password, etc.)
    
-   **Hotel**: Stores hotel details (id, name, address, latitude, longitude, etc.)
    
-   **Room**: Stores room details (id, room type, price, status, etc.)
    
-   **Booking**: Stores booking information (check-in/out dates, status, etc.)
    
-   **Review**: Stores reviews for hotels and rooms (rating, comment, etc.)
    
-   **Payment**: Stores payment information (method, amount, transaction date, etc.)
    
-   **Notification**: Stores notifications for users (message, type, status, etc.)
    

## API Endpoints

Below are some of the key endpoints exposed by the backend:

-   **POST /api/users/register**: Register a new user
    
-   **POST /api/users/login**: Log in a user
    
-   **GET /api/hotels**: Retrieve a list of hotels
    
-   **POST /api/bookings**: Create a new booking
    
-   **GET /api/bookings/{id}**: View booking details
    
-   **PUT /api/bookings/{id}**: Update an existing booking
    
-   **DELETE /api/bookings/{id}**: Cancel a booking
    
-   **POST /api/payments**: Process a payment
    
-   **POST /api/reviews**: Leave a review for a hotel or room
    

## Testing

The application uses **JUnit** and **Mockito** for unit testing. To run the tests, use the following Maven command:
```bash
mvn test
```

### Code Coverage with JaCoCo

The project uses JaCoCo for code coverage reporting. To generate and view the coverage report:

1. Run the tests with coverage:
```bash
mvn clean test jacoco:report
```

2. The coverage report will be generated in `target/site/jacoco/index.html`. You can open this file in your web browser using:
```bash
start target/site/jacoco/index.html
```

The report includes:
- Overall coverage percentage
- Line coverage
- Branch coverage
- Method coverage
- Class coverage

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to submit a pull request.

