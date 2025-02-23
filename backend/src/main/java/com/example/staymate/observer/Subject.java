package com.example.staymate.observer;

import com.example.staymate.entity.notification.Notification;

public interface Subject {
    void addObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers(Notification notification);
}
