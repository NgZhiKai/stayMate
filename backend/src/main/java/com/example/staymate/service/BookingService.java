package com.example.staymate.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.observer.NotificationObserver;
import com.example.staymate.observer.Observer;
import com.example.staymate.observer.Subject;
import com.example.staymate.repository.BookingRepository;

@Service
public class BookingService implements Subject {

    private final BookingRepository bookingRepository;
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
    public void notifyObservers(Notification notification) {
        for (Observer observer : observers) {
            observer.update(notification);
        }
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
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            Notification notification = new Notification();
            notification.setUser(booking.getUser());
            notification.setMessage("Your booking has been confirmed!");
            notification.setType(NotificationType.BOOKING);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notifyObservers(notification);
        } else if (booking.getStatus() == BookingStatus.CANCELLED) {
            Notification notification = new Notification();
            notification.setUser(booking.getUser());
            notification.setMessage("Your booking has been canceled.");
            notification.setType(NotificationType.BOOKING);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notifyObservers(notification);
        }

        return updatedBooking;
    }

    // Cancel a booking and notify observers
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking != null) {
            booking.setStatus(BookingStatus.CANCELLED);
            Booking canceledBooking = bookingRepository.save(booking);

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
}
