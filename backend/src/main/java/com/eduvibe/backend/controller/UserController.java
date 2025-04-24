package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Adjust as needed
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.getUserIdentifier(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inner class for login request payload
    public static class LoginRequest {
        private String userIdentifier;
        private String password;

        public String getUserIdentifier() { return userIdentifier; }
        public void setUserIdentifier(String userIdentifier) { this.userIdentifier = userIdentifier; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}