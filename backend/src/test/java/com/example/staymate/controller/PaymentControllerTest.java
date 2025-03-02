package com.example.staymate.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.dto.payment.PaymentRequestDTO;
import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.enums.PaymentStatus;
import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.entity.user.User;
import com.example.staymate.factory.RoomFactory;
import com.example.staymate.service.PaymentService;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
    }

    // Test Case for creating and processing payment
    @Test
    void testCreateAndProcessPayment() throws Exception {
        Long userId = 1L;
        Long hotelId = 1L;
        Long generatedRoomId = 101L;
        LocalDate checkInDate = LocalDate.of(2025, 2, 23); // Set the check-in date as per the request
        LocalDate checkOutDate = LocalDate.of(2025, 2, 25); // Set the check-out date as per the request
        double totalAmount = 100.0;
        RoomType roomType = RoomType.SINGLE;
        double pricePerNight = 50.0;
        int maxOccupancy = 2;

        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);

        User user = new User();
        user.setId(userId);

        Room mockRoom = RoomFactory.createRoom(mockHotel, generatedRoomId, roomType, pricePerNight, maxOccupancy);
        mockRoom.setId(new RoomId(hotelId, generatedRoomId));
        mockRoom.setMaxOccupancy(maxOccupancy);
        mockRoom.setPricePerNight(pricePerNight);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        // Prepare mock booking and payment
        Booking mockBooking = new Booking();
        mockBooking.setId(1L);
        mockBooking.setUser(user);
        mockBooking.setRoom(mockRoom);
        mockBooking.setCheckInDate(checkInDate);
        mockBooking.setCheckOutDate(checkOutDate);
        mockBooking.setBookingDate(checkInDate);
        mockBooking.setTotalAmount(totalAmount);
        mockBooking.setStatus(BookingStatus.PENDING);

        Payment mockPayment = new Payment();
        mockPayment.setId(1L);
        mockPayment.setAmount(50.00);
        mockPayment.setStatus(PaymentStatus.SUCCESS);
        mockPayment.setBooking(mockBooking); // Set the booking
        mockPayment.setPaymentMethod(PaymentMethod.STRIPE);
        mockPayment.setTransactionDate(LocalDateTime.now());

        when(paymentService.createPayment(anyLong(), any(PaymentMethod.class), anyDouble())).thenReturn(mockPayment);
        doNothing().when(paymentService).processPayment(anyLong(), any(PaymentMethod.class));
        when(paymentService.getPaymentById(anyLong())).thenReturn(mockPayment);

        // Create PaymentRequestDTO mock
        PaymentRequestDTO paymentRequestDTO = new PaymentRequestDTO();
        paymentRequestDTO.setBookingId(mockBooking.getId());
        paymentRequestDTO.setAmount(mockPayment.getAmount());

        // Perform the POST request to create and process payment
        mockMvc.perform(post("/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"bookingId\":1, \"amount\":50.0}")
                .param("paymentMethod", "STRIPE"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message")
                        .value("Payment created and processed successfully. Current status: SUCCESS"));
    }

    // Test Case for getting payment by ID (SUCCESS status)
    @Test
    void testGetPaymentById_Success() throws Exception {
        Long userId = 1L;
        Long hotelId = 1L;
        Long generatedRoomId = 101L;
        LocalDate checkInDate = LocalDate.of(2025, 2, 23); // Set the check-in date as per the request
        LocalDate checkOutDate = LocalDate.of(2025, 2, 25); // Set the check-out date as per the request
        double totalAmount = 100.0;
        RoomType roomType = RoomType.SINGLE;
        double pricePerNight = 50.0;
        int maxOccupancy = 2;

        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);

        User user = new User();
        user.setId(userId);

        Room mockRoom = RoomFactory.createRoom(mockHotel, generatedRoomId, roomType, pricePerNight, maxOccupancy);
        mockRoom.setId(new RoomId(hotelId, generatedRoomId));
        mockRoom.setMaxOccupancy(maxOccupancy);
        mockRoom.setPricePerNight(pricePerNight);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        // Prepare mock booking and payment
        Booking mockBooking = new Booking();
        mockBooking.setId(1L);
        mockBooking.setUser(user);
        mockBooking.setRoom(mockRoom);
        mockBooking.setCheckInDate(checkInDate);
        mockBooking.setCheckOutDate(checkOutDate);
        mockBooking.setBookingDate(checkInDate);
        mockBooking.setTotalAmount(totalAmount);
        mockBooking.setStatus(BookingStatus.PENDING);

        Payment mockPayment = new Payment();
        mockPayment.setId(1L);
        mockPayment.setAmount(50.00);
        mockPayment.setStatus(PaymentStatus.SUCCESS);
        mockPayment.setBooking(mockBooking); // Set the booking

        when(paymentService.getPaymentById(1L)).thenReturn(mockPayment);

        // Perform API request and validate response
        mockMvc.perform(get("/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Payment retrieved successfully"))
                .andExpect(jsonPath("$.data.paymentId").value(1))
                .andExpect(jsonPath("$.data.paymentStatus").value("SUCCESS"));
    }

    // Test Case for getting payment by ID (CANCELLED status)
    @Test
    void testGetPaymentById_Cancelled() throws Exception {
        Long userId = 1L;
        Long hotelId = 1L;
        Long generatedRoomId = 101L;
        LocalDate checkInDate = LocalDate.of(2025, 2, 23); // Set the check-in date as per the request
        LocalDate checkOutDate = LocalDate.of(2025, 2, 25); // Set the check-out date as per the request
        double totalAmount = 100.0;
        RoomType roomType = RoomType.SINGLE;
        double pricePerNight = 50.0;
        int maxOccupancy = 2;

        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);

        User user = new User();
        user.setId(userId);

        Room mockRoom = RoomFactory.createRoom(mockHotel, generatedRoomId, roomType, pricePerNight, maxOccupancy);
        mockRoom.setId(new RoomId(hotelId, generatedRoomId));
        mockRoom.setMaxOccupancy(maxOccupancy);
        mockRoom.setPricePerNight(pricePerNight);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        // Prepare mock booking and payment
        Booking mockBooking = new Booking();
        mockBooking.setId(1L);
        mockBooking.setUser(user);
        mockBooking.setRoom(mockRoom);
        mockBooking.setCheckInDate(checkInDate);
        mockBooking.setCheckOutDate(checkOutDate);
        mockBooking.setBookingDate(checkInDate);
        mockBooking.setTotalAmount(totalAmount);
        mockBooking.setStatus(BookingStatus.PENDING);

        Payment mockPayment = new Payment();
        mockPayment.setId(2L);
        mockPayment.setAmount(50.00);
        mockPayment.setStatus(PaymentStatus.FAILED);
        mockPayment.setBooking(mockBooking); // Set the booking

        when(paymentService.getPaymentById(2L)).thenReturn(mockPayment);

        // Perform API request and validate response
        mockMvc.perform(get("/payments/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Payment retrieved successfully"))
                .andExpect(jsonPath("$.data.paymentId").value(2))
                .andExpect(jsonPath("$.data.paymentStatus").value("FAILED"));
    }

    // Test Case for getting payments by booking ID (PENDING status)
    @Test
    void testGetPaymentsByBookingId() throws Exception {
        Long userId = 1L;
        Long hotelId = 1L;
        Long generatedRoomId = 101L;
        LocalDate checkInDate = LocalDate.of(2025, 2, 23);
        LocalDate checkOutDate = LocalDate.of(2025, 2, 25);
        double totalAmount = 100.0;
        RoomType roomType = RoomType.SINGLE;
        double pricePerNight = 50.0;
        int maxOccupancy = 2;

        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);

        User user = new User();
        user.setId(userId);

        Room mockRoom = RoomFactory.createRoom(mockHotel, generatedRoomId, roomType, pricePerNight, maxOccupancy);
        mockRoom.setId(new RoomId(hotelId, generatedRoomId));
        mockRoom.setMaxOccupancy(maxOccupancy);
        mockRoom.setPricePerNight(pricePerNight);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        // Prepare mock booking and payment
        Booking mockBooking = new Booking();
        mockBooking.setId(1L);
        mockBooking.setUser(user);
        mockBooking.setRoom(mockRoom);
        mockBooking.setCheckInDate(checkInDate);
        mockBooking.setCheckOutDate(checkOutDate);
        mockBooking.setBookingDate(checkInDate);
        mockBooking.setTotalAmount(totalAmount);
        mockBooking.setStatus(BookingStatus.PENDING);

        // Creating mock payments
        Payment payment1 = new Payment();
        payment1.setId(1L);
        payment1.setAmount(100.00);
        payment1.setStatus(PaymentStatus.PENDING);
        payment1.setBooking(mockBooking);
        payment1.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        payment1.setTransactionDate(LocalDateTime.now());

        Payment payment2 = new Payment();
        payment2.setId(2L);
        payment2.setAmount(150.00);
        payment2.setStatus(PaymentStatus.PENDING);
        payment2.setBooking(mockBooking);
        payment2.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        payment2.setTransactionDate(LocalDateTime.now().plusDays(1));

        List<Payment> payments = List.of(payment1, payment2);

        when(paymentService.getPaymentsByBookingId(anyLong())).thenReturn(payments);

        // Perform API request and validate response
        mockMvc.perform(get("/payments/booking/1"))
                .andExpect(jsonPath("$.message").value("Payments retrieved successfully"))
                .andExpect(jsonPath("$.data[0].paymentId").value(1))
                .andExpect(jsonPath("$.data[1].paymentId").value(2));
    }

    // Test Case for error handling in getPaymentById (Payment Not Found)
    @Test
    void testGetPaymentById_NotFound() throws Exception {
        // Mock the service to return null when payment is not found
        when(paymentService.getPaymentById(1L)).thenReturn(null);

        // Perform the API request and validate the response
        mockMvc.perform(get("/payments/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Payment not found"));
    }

    // Test Case for error handling in getPaymentsByBookingId (Payments Not Found)
    @Test
    void testGetPaymentsByBookingId_NotFound() throws Exception {
        // Mock the service to return an empty list when no payments are found
        when(paymentService.getPaymentsByBookingId(1L)).thenReturn(null);

        // Perform the API request and validate the response
        mockMvc.perform(get("/payments/booking/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Payments not found"));
    }
}
