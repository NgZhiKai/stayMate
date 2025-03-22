package com.example.staymate.observer;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.staymate.entity.user.User;
import com.example.staymate.service.EmailService;

@Component
public class EmailObserver implements Observer {

    @Autowired
    private EmailService emailService;

    // Constructor
    public EmailObserver(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void update(Map<String, Object> data) {
        // Retrieve the user and verification link from the data map
        User user = (User) data.get("user");
        String verificationLink = (String) data.get("verificationLink");

        // Make sure that both user and verificationLink are not null
        if (user != null && verificationLink != null) {
            // Send the verification email
            emailService.sendVerificationEmail(user.getEmail(), verificationLink);
        }
    }
}
