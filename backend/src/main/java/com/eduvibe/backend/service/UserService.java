package com.eduvibe.backend.service;

import com.eduvibe.backend.model.User;
import com.eduvibe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User signup(User user) throws Exception {
        // Check if username or email already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String userIdentifier, String password) throws Exception {
        // Find user by username or email
        User user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new Exception("User not found"));

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return user;
    }

    public void addCourseToUser(String userId, String courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.out.println("User not found for ID: " + userId); // Log user not found
                    return new IllegalArgumentException("User not found with ID: " + userId);
                });
        user.getCourses().add(courseId);
        System.out.println("Adding course " + courseId + " to user " + userId);
        userRepository.save(user);
        System.out.println("User courses after save: " + user.getCourses());
    }
}