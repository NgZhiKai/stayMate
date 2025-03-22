package com.example.staymate.observer;

import java.util.Map;

public interface Subject {
    void addObserver(Observer observer);

    void removeObserver(Observer observer);

    void notifyObservers(Map<String, Object> data);
}
