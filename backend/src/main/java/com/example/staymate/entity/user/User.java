package com.example.staymate.entity.user;

import org.mindrot.jbcrypt.BCrypt;  // Import BCrypt class

import com.example.staymate.entity.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users") // Avoids SQL conflicts with reserved keywords
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Must be hashed before saving!

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    // Default constructor
    public User() {}

    // Constructor for easy object creation
    public User(String firstName, String lastName, String email, String password, String phoneNumber, UserRole role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        setPassword(password); // Ensure password is hashed
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    @PrePersist
    protected void prePersist() {
        if (role == null) {
            role = UserRole.CUSTOMER; // Default role if none provided
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    // Hash password manually before setting it
    public void setPassword(String password) {
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

}
