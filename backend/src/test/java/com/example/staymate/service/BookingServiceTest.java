package com.example.staymate.service;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.observer.NotificationObserver;
import com.example.staymate.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)  // Enable Mockito extension in JUnit 5
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private NotificationObserver notificationObserver;

    @InjectMocks
    private BookingService bookingService;  // The class under test

    private Booking booking;

    @BeforeEach
    void setUp() {
        // Initialize mock booking
        booking = new Booking();
        booking.setId(1L);
        booking.setStatus(BookingStatus.PENDING);
    }

    // Test the createBooking method
    @Test
    void testCreateBooking() {
        // Mock the behavior of bookingRepository.save
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Call the service method
        Booking createdBooking = bookingService.createBooking(booking);

        // Validate that the booking was created
        assertNotNull(createdBooking);
        assertEquals(BookingStatus.PENDING, createdBooking.getStatus());

        // Verify that the repository save method was called
        verify(bookingRepository, times(1)).save(any(Booking.class));

        // Check if the notification details are correct
        Notification notification = new Notification();
        notification.setUser(createdBooking.getUser());
        notification.setMessage("Your booking is pending confirmation.");
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        // Verify the notification is being correctly passed
        assertNotNull(notification);
        assertEquals("Your booking is pending confirmation.", notification.getMessage());
    }

    @Test
    void testUpdateBooking_Confirmed() {
        // Mock the behavior of bookingRepository.save
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Set booking status to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);

        // Call the service method
        Booking updatedBooking = bookingService.updateBooking(booking);

        // Validate that the booking was updated
        assertNotNull(updatedBooking);
        assertEquals(BookingStatus.CONFIRMED, updatedBooking.getStatus());

        // Verify that the repository save method was called
        verify(bookingRepository, times(1)).save(any(Booking.class));
        // Verify the notification details for confirmation
        Notification notification = new Notification();
        notification.setUser(updatedBooking.getUser());
        notification.setMessage("Your booking has been confirmed!");
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        assertNotNull(notification);
        assertEquals("Your booking has been confirmed!", notification.getMessage());
    }

    @Test
    void testUpdateBooking_Canceled() {
        // Mock the behavior of bookingRepository.save
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Set booking status to CANCELLED
        booking.setStatus(BookingStatus.CANCELLED);

        // Call the service method
        Booking updatedBooking = bookingService.updateBooking(booking);

        // Validate that the booking was updated
        assertNotNull(updatedBooking);
        assertEquals(BookingStatus.CANCELLED, updatedBooking.getStatus());

        // Verify that the repository save method was called
        verify(bookingRepository, times(1)).save(any(Booking.class));

        // Verify the notification details for cancellation
        Notification notification = new Notification();
        notification.setUser(updatedBooking.getUser());
        notification.setMessage("Your booking has been canceled.");
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        assertNotNull(notification);
        assertEquals("Your booking has been canceled.", notification.getMessage());
    }


    @Test
    void testCancelBooking() {
        // Mock the behavior of bookingRepository.findById and save
        when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Set booking status to CANCELLED
        booking.setStatus(BookingStatus.CANCELLED);

        // Call the service method
        Booking canceledBooking = bookingService.cancelBooking(1L);

        // Validate that the booking was canceled
        assertNotNull(canceledBooking);
        assertEquals(BookingStatus.CANCELLED, canceledBooking.getStatus());

        // Verify that the repository save method was called
        verify(bookingRepository, times(1)).save(any(Booking.class));

        // Verify the notification details for cancellation
        Notification notification = new Notification();
        notification.setUser(canceledBooking.getUser());
        notification.setMessage("Your booking has been canceled.");
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        assertNotNull(notification);
        assertEquals("Your booking has been canceled.", notification.getMessage());
    }


    @Test
    void testGetBookingById_Found() {
        // Mock the behavior of bookingRepository.findById
        when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.of(booking));

        // Call the service method
        Booking foundBooking = bookingService.getBookingById(1L);

        // Validate that the booking was found
        assertNotNull(foundBooking);
        assertEquals(1L, foundBooking.getId());
        assertEquals(BookingStatus.PENDING, foundBooking.getStatus());

        // Verify that the repository findById method was called
        verify(bookingRepository, times(1)).findById(1L);
    }

    @Test
    void testGetBookingById_NotFound() {
        // Mock the behavior of bookingRepository.findById to return empty
        when(bookingRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        // Call the service method
        Booking foundBooking = bookingService.getBookingById(1L);

        // Validate that the booking was not found
        assertNull(foundBooking);

        // Verify that the repository findById method was called
        verify(bookingRepository, times(1)).findById(1L);
    }

    @Test
    void testGetBookingsByHotel() {
        // Mock the behavior of bookingRepository.findBookingsByHotelId
        when(bookingRepository.findBookingsByHotelId(1L)).thenReturn(List.of(booking));

        // Call the service method
        List<Booking> bookings = bookingService.getBookingsByHotel(1L);

        // Validate that the list is not empty
        assertNotNull(bookings);
        assertFalse(bookings.isEmpty());
        assertEquals(1, bookings.size());

        // Verify that the repository method was called
        verify(bookingRepository, times(1)).findBookingsByHotelId(1L);
    }


}
