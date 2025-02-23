package com.example.staymate.observer;

import com.example.staymate.entity.notification.Notification;

public interface Observer {
    void update(Notification notification);
}

