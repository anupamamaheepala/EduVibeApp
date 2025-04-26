package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

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

        // Build custom response with only needed fields
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("userId", user.getId()); // ✅ This fixes your undefined issue

        // Add token here if you have authentication
        // response.put("token", jwtToken);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}


    // Logout endpoint to clear the session on frontend side
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // If you're using JWT, you don't really need to do anything in the backend, 
        // since JWT is stateless. Just return a success message.
        return ResponseEntity.ok("Logged out successfully");
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