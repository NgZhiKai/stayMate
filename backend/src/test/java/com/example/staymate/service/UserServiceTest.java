package com.example.staymate.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
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
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.staymate.entity.enums.UserRole;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

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
        user.setPhoneNumber("123456789");
        user.setRole(UserRole.CUSTOMER);
    }

    // Test for registerUser method (successful registration)
    @Test
    void testRegisterUser_Success() {
        // Mock userRepository.findByEmail to return empty (no user with the same email)
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Mock userRepository.save to return the saved user
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Call the service method
        User registeredUser = userService.registerUser(user);

        // Validate that the user was registered
        assertNotNull(registeredUser);
        assertEquals("John", registeredUser.getFirstName());
        assertEquals("Doe", registeredUser.getLastName());

        // Verify the repository methods were called
        verify(userRepository, times(1)).findByEmail(user.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    // Test for registerUser method (duplicate email)
    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Mock userRepository.findByEmail to return an existing user with the same email
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

        // Create an updated user
        User updatedUser = new User();
        updatedUser.setFirstName("Jane");
        updatedUser.setLastName("Smith");
        updatedUser.setEmail("jane.smith@example.com");
        updatedUser.setPhoneNumber("987654321");
        updatedUser.setRole(UserRole.ADMIN);

        // Call the service method
        User updated = userService.updateUser(user.getId(), updatedUser);

        // Validate the updated user
        assertNotNull(updated);
        assertEquals("Jane", updated.getFirstName());
        assertEquals("Smith", updated.getLastName());

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
}
