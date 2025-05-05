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
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String userIdentifier, String password) throws Exception {
        User user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return user;
    }

    public User getUserById(String userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
    }

    public User updateUser(String userId, User updatedUser) throws Exception {
        User existingUser = getUserById(userId);
        
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getProfilePicture() != null) {
            existingUser.setProfilePicture(updatedUser.getProfilePicture());
        }
        
        return userRepository.save(existingUser);
    }

    public void deleteUser(String userId) throws Exception {
        User user = getUserById(userId); // Verify user exists
        userRepository.delete(user);
    }
}