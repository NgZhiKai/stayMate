package com.example.staymate.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.staymate.entity.enums.UserRole;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.InvalidUserException;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.observer.Observer;
import com.example.staymate.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Observer notificationObserver;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        // Initialize mock user
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPassword("testing");
        user.setPhoneNumber("123456789");
        user.setRole(UserRole.CUSTOMER);
        user.setVerified(false);
    }

    @Test
    void testRegisterUser_Success() {

        // Mock userRepository.findByEmail to return empty (no user with the same email)
        lenient().when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Mock userRepository.save to return the saved user
        lenient().when(userRepository.save(any(User.class))).thenReturn(user);

        // Register the user
        User savedUser = userService.registerUser(user);

        // // Verify that the repository methods were called exactly once
        verify(userRepository, times(1)).findByEmail(savedUser.getEmail());
        verify(userRepository, times(2)).save(savedUser);
    }

    // Test for registerUser method (duplicate email)
    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Mock userRepository.findByEmail to return an existing user with the same
        // email
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Call the service method and expect an IllegalArgumentException
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(user));

        // Verify that findByEmail was called
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    // Test for getAllUsers method
    @Test
    void testGetAllUsers() {
        // Mock userRepository.findAll to return a list of users
        when(userRepository.findAll()).thenReturn(List.of(user));

        // Call the service method
        List<User> users = userService.getAllUsers();

        // Validate the list of users
        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("John", users.get(0).getFirstName());

        // Verify the repository method was called
        verify(userRepository, times(1)).findAll();
    }

    // Test for getUserById method (user exists)
    @Test
    void testGetUserById_Success() {
        // Mock userRepository.findById to return the user
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Call the service method
        User foundUser = userService.getUserById(user.getId());

        // Validate the returned user
        assertNotNull(foundUser);
        assertEquals("John", foundUser.getFirstName());

        // Verify the repository method was called
        verify(userRepository, times(1)).findById(user.getId());
    }

    // Test for getUserById method (user not found)
    @Test
    void testGetUserById_NotFound() {
        // Mock userRepository.findById to return empty (user not found)
        when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

        // Call the service method and expect ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(user.getId()));

        // Verify the repository method was called
        verify(userRepository, times(1)).findById(user.getId());
    }

    // Test for getUserByEmail method (user exists)
    @Test
    void testGetUserByEmail_Success() {
        // Mock userRepository.findByEmail to return the user
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Call the service method
        User foundUser = userService.getUserByEmail(user.getEmail());

        // Validate the returned user
        assertNotNull(foundUser);
        assertEquals("John", foundUser.getFirstName());

        // Verify the repository method was called
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    // Test for getUserByEmail method (user not found)
    @Test
    void testGetUserByEmail_NotFound() {
        // Mock userRepository.findByEmail to return empty (user not found)
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Call the service method and expect ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserByEmail(user.getEmail()));

        // Verify the repository method was called
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    // Test for updateUser method (user exists)
    @Test
    void testUpdateUser_Success() {
        // Mock userRepository.findById to return the existing user
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Mock userRepository.save to return the updated user
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Call the service method
        User updated = userService.updateUser(user.getId(), user);

        // Validate the updated user
        assertNotNull(updated);
        assertEquals("John", updated.getFirstName());
        assertEquals("Doe", updated.getLastName());

        // Verify the repository methods were called
        verify(userRepository, times(1)).findById(user.getId());
    }

    // Test for updateUser method (user not found)
    @Test
    void testUpdateUser_NotFound() {
        // Mock userRepository.findById to return empty (user not found)
        when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

        // Call the service method and expect ResourceNotFoundException
        User updatedUser = new User();
        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(user.getId(), updatedUser));

        // Verify the repository method was called
        verify(userRepository, times(1)).findById(user.getId());
    }

    // Test for deleteUser method (user exists)
    @Test
    void testDeleteUser_Success() {
        // Mock userRepository.existsById to return true (user exists)
        when(userRepository.existsById(user.getId())).thenReturn(true);

        // Call the service method
        userService.deleteUser(user.getId());

        // Verify the repository method was called
        verify(userRepository, times(1)).existsById(user.getId());
        verify(userRepository, times(1)).deleteById(user.getId());
    }

    // Test for deleteUser method (user not found)
    @Test
    void testDeleteUser_NotFound() {
        // Mock userRepository.existsById to return false (user not found)
        when(userRepository.existsById(user.getId())).thenReturn(false);

        // Call the service method and expect ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(user.getId()));

        // Verify the repository method was called
        verify(userRepository, times(1)).existsById(user.getId());
    }

    @Test
    public void testGenerateVerificationToken_Success() {
        // Stub the userRepository.save method to return the user
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act: Call the method
        String token = userService.generateVerificationToken(user);

        // Assert: Verify the token is not null and the user was updated
        assertNotNull(token);
        assertEquals(token, user.getVerificationToken());
        verify(userRepository).save(user); // Ensure the user was saved after setting the token
    }

    @Test
    public void testGenerateVerificationToken_ThrowsExceptionForNullUser() {
        // Act & Assert: Expect an exception when null is passed
        assertThrows(InvalidUserException.class, () -> {
            userService.generateVerificationToken(null);
        });
    }

    @Test
    public void testLoginUser_Success() {
        // Arrange
        String email = "john.doe@example.com";
        String password = "testing";
        String expectedToken = "sampleJwtToken";
        UserRole role = UserRole.ADMIN;

        // Create a mock of the UserService
        UserService userServiceMock = Mockito.spy(userService);
        User userSpy = Mockito.spy(user); // Use a spy on the user
        userSpy.setRole(role);

        // Mock the behavior of userRepository and user
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(userSpy)); // Use userSpy here
        when(userSpy.checkPassword(password)).thenReturn(true); // Simulate valid password
        when(userSpy.isVerified()).thenReturn(true); // Simulate verified user

        // Mock the token generation
        when(userServiceMock.generateVerificationToken(userSpy)).thenReturn(expectedToken); // Use userSpy here

        // Act
        String token = userServiceMock.loginUser(email, password, "admin");

        // Assert
        assertEquals(expectedToken, token);
        verify(userRepository, times(1)).findByEmail(email); // Ensure findByEmail was called
        verify(userSpy, times(1)).checkPassword(password); // Ensure checkPassword was called
        verify(userServiceMock, times(1)).generateVerificationToken(userSpy); // Ensure token generation was called
    }

    @Test
    public void testLoginUser_EmailNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        String password = "password123";

        // Mock the behavior of userRepository to return empty for non-existing user
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.loginUser(email, password, "admin"));
    }

    @Test
    public void testLoginUser_InvalidPassword() {
        // Arrange
        String email = "user@example.com";
        String password = "wrongPassword";

        // Create a spy to call actual methods but mock specific ones
        User userSpy = Mockito.spy(user);

        // Mock the behavior of userRepository
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(userSpy));

        // Mock the checkPassword method on the spy object to return false
        when(userSpy.checkPassword(password)).thenReturn(false); // Simulate invalid

        // Act & Assert
        assertThrows(InvalidUserException.class, () -> userService.loginUser(email,
                password, "admin"));
    }

    @Test
    public void testLoginUser_UnverifiedUser() {
        // Arrange
        String email = "user@example.com";
        String password = "password123";

        // Simulate an unverified user
        user.setVerified(false);

        // Create a spy to call actual methods but mock specific ones
        User userSpy = Mockito.spy(user);

        // Mock the behavior of userRepository
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(userSpy));

        // Mock the checkPassword method on the spy object to return false
        when(userSpy.checkPassword(password)).thenReturn(true); // Simulate invalid

        // Act & Assert
        assertThrows(InvalidUserException.class, () -> userService.loginUser(email,
                password, "admin"));
    }

    @Test
    public void testLoginUser_NullEmail() {
        // Arrange
        String email = null;
        String password = "password123";

        // Act & Assert
        assertThrows(InvalidUserException.class, () -> userService.loginUser(email,
                password, "admin"));
    }

    @Test
    public void testLoginUser_NullPassword() {
        // Arrange
        String email = "user@example.com";
        String password = null;

        // Act & Assert
        assertThrows(InvalidUserException.class, () -> userService.loginUser(email,
                password, "admin"));
    }

    @Test
    public void testLoginUser_RoleMismatch() {
        // Arrange
        String email = "user@example.com";
        String password = "password123";
        String providedRole = "admin"; // The role provided by the user (to be tested)
        String userRole = "customer"; // The role actually assigned to the user in the system

        // Create a mock user with the role that doesn't match the provided role
        User user = mock(User.class); // Use a mock User instead of a real one
        user.setEmail(email); // Set email for the mock
        user.setPassword(password); // Set password for the mock
        user.setRole(UserRole.valueOf(userRole.toUpperCase())); // Set role as "customer"
        user.setVerified(true); // Ensure the user is verified

        // Mock the repository to return the user
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user)); // Mock user retrieval

        // Mock the password check to return true (valid password)
        when(user.checkPassword(password)).thenReturn(true);

        // Act & Assert
        // Ensure that the method throws an InvalidUserException for role mismatch
        assertThrows(InvalidUserException.class, () -> userService.loginUser(email, password, providedRole));

        // Verify that the repository was called to fetch the user
        verify(userRepository, times(1)).findByEmail(email);

        // Verify that the password check was performed
        verify(user, times(1)).checkPassword(password);
    }

}