package com.example.staymate.service;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Send email with verification link
    public void sendVerificationEmail(String to, String verificationLink, String token) {
        String subject = "Email Verification";

        // Read the HTML content from the template
        String body = getEmailContentWithVerificationLink(verificationLink, token);

        sendSimpleEmail(to, subject, body);
    }

    private String getEmailContentWithVerificationLink(String verificationLink, String token) {
        try {
            // Read the HTML content from the template
            var inputStream = Objects
                    .requireNonNull(EmailService.class.getResourceAsStream("/templates/email-content.html"));
            String emailContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            // Replace the placeholder with the actual verification link
            // emailContent = emailContent.replace("{{verificationLink}}",
            // verificationLink);
            emailContent = emailContent.replace("{{token}}", token);

            return emailContent;
        } catch (Exception e) {
            // Handle exception
            throw new RuntimeException("Error reading email template", e);
        }
    }

    // Send email with dynamic body content
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);

        } catch (Exception e) {
            // Handle email related exceptions
            throw new RuntimeException("Error sending email", e);
        }
    }
}