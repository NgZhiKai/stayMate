package com.example.staymate.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.room.Room;
import com.example.staymate.observer.NotificationObserver;
import com.example.staymate.observer.Observer;
import com.example.staymate.observer.Subject;
import com.example.staymate.repository.BookingRepository;
import com.example.staymate.repository.RoomRepository;

@Service
public class BookingService implements Subject {

    @Autowired
    private final BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    private final List<Observer> observers = new ArrayList<>();

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Map<String, Object> data) {
        for (Observer observer : observers) {
            observer.update(data);
        }
    }

    public void notifyObservers(Notification notification) {
        Map<String, Object> data = new HashMap<>();
        data.put("notification", notification);
        notifyObservers(data);
    }

    @Autowired
    public void setNotificationObserver(NotificationObserver notificationObserver) {
        addObserver(notificationObserver);
    }

    // Create a new booking and notify observers
    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        // Notify observers about the new booking
        Notification notification = new Notification();
        notification.setUser(booking.getUser());
        notification.setMessage("Your booking is pending confirmation.");
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notifyObservers(notification);

        return savedBooking;
    }

    // Update booking status and notify observers
    @Transactional
    public Booking updateBooking(Booking booking) {
        Booking updatedBooking = bookingRepository.save(booking);

        // Notify observers when a booking is confirmed or canceled
        Notification notification = new Notification();
        notification.setUser(booking.getUser());
        notification.setType(NotificationType.BOOKING);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            notification.setMessage("Your booking has been confirmed!");
        } else if (booking.getStatus() == BookingStatus.CANCELLED) {
            notification.setMessage("Your booking has been canceled.");
        }

        notifyObservers(notification);

        return updatedBooking;
    }

    // Cancel a booking and notify observers
    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking != null) {
            booking.setStatus(BookingStatus.CANCELLED);
            Booking canceledBooking = bookingRepository.save(booking);

            // Make the room available again
            Room room = roomRepository.findById(booking.getRoom().getId()).orElse(null);
            System.out.println("Fetched Room: " + (room != null ? room.getId() : "null"));
            if (room != null) {
                room.setStatus(RoomStatus.AVAILABLE);
                roomRepository.save(room);
            }


            Notification notification = new Notification();
            notification.setUser(booking.getUser());
            notification.setMessage("Your booking has been canceled.");
            notification.setType(NotificationType.BOOKING);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());

            notifyObservers(notification);

            return canceledBooking;
        }
        return null;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findBookingsByHotelId(hotelId);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findBookingsByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
