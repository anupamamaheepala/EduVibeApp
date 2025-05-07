// package com.eduvibe.backend.controller;

// import com.eduvibe.backend.model.User;
// import com.eduvibe.backend.service.UserService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.Map;
// import java.util.HashMap;

// @RestController
// @RequestMapping("/api/auth")
// @CrossOrigin(origins = "http://localhost:3000")
// public class UserController {

//     @Autowired
//     private UserService userService;


// @GetMapping("/users")
//     public ResponseEntity<?> getAllUsers() {
//         return ResponseEntity.ok(userService.getAllUsers());
//     }

//     @PostMapping("/signup")
//     public ResponseEntity<?> signup(@RequestBody User user) {
//         try {
//             User savedUser = userService.signup(user);
//             return ResponseEntity.ok(savedUser);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//         try {
//             User user = userService.login(loginRequest.getUserIdentifier(), loginRequest.getPassword());

//             Map<String, Object> response = new HashMap<>();
//             response.put("username", user.getUsername());
//             response.put("userId", user.getId());
//             response.put("token", "your-jwt-token"); // Replace with actual JWT generation

//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PostMapping("/google-login")
//     public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) {
//         try {
//             User user = userService.handleGoogleLogin(
//                 googleLoginRequest.getGoogleId(),
//                 googleLoginRequest.getUsername(),
//                 googleLoginRequest.getEmail(),
//                 googleLoginRequest.getFirstName(),
//                 googleLoginRequest.getLastName(),
//                 googleLoginRequest.getProfilePicture()
//             );

//             Map<String, Object> response = new HashMap<>();
//             response.put("username", user.getUsername());
//             response.put("userId", user.getId());
//             response.put("token", "your-jwt-token"); // Replace with actual JWT generation

//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PostMapping("/logout")
//     public ResponseEntity<?> logout() {
//         return ResponseEntity.ok("Logged out successfully");
//     }

//     @GetMapping("/user/{userId}")
//     public ResponseEntity<?> getUserById(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
//         try {
//             // Validate JWT token (placeholder; implement actual validation)
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 return ResponseEntity.status(401).body("Unauthorized");
//             }
//             User user = userService.getUserById(userId);
//             return ResponseEntity.ok(user);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PutMapping("/user/{userId}")
//     public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User updatedUser, @RequestHeader("Authorization") String authHeader) {
//         try {
//             // Validate JWT token (placeholder; implement actual validation)
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 return ResponseEntity.status(401).body("Unauthorized");
//             }
//             User user = userService.updateUser(userId, updatedUser);
//             return ResponseEntity.ok(user);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @DeleteMapping("/user/{userId}")
//     public ResponseEntity<?> deleteUser(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
//         try {
//             // Validate JWT token (placeholder; implement actual validation)
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 return ResponseEntity.status(401).body("Unauthorized");
//             }
//             userService.deleteUser(userId);
//             return ResponseEntity.ok("Profile deleted successfully");
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     public static class LoginRequest {
//         private String userIdentifier;
//         private String password;

//         public String getUserIdentifier() { return userIdentifier; }
//         public void setUserIdentifier(String userIdentifier) { this.userIdentifier = userIdentifier; }

//         public String getPassword() { return password; }
//         public void setPassword(String password) { this.password = password; }
//     }

//     public static class GoogleLoginRequest {
//         private String googleId;
//         private String username;
//         private String email;
//         private String firstName;
//         private String lastName;
//         private String profilePicture;

//         public String getGoogleId() { return googleId; }
//         public void setGoogleId(String googleId) { this.googleId = googleId; }

//         public String getUsername() { return username; }
//         public void setUsername(String username) { this.username = username; }

//         public String getEmail() { return email; }
//         public void setEmail(String email) { this.email = email; }

//         public String getFirstName() { return firstName; }
//         public void setFirstName(String firstName) { this.firstName = firstName; }

//         public String getLastName() { return lastName; }
//         public void setLastName(String lastName) { this.lastName = lastName; }

//         public String getProfilePicture() { return profilePicture; }
//         public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
//     }
// }


package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

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

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("userId", user.getId());
            response.put("token", "your-jwt-token"); // Replace with actual JWT generation

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            User user = userService.handleGoogleLogin(
                googleLoginRequest.getGoogleId(),
                googleLoginRequest.getUsername(),
                googleLoginRequest.getEmail(),
                googleLoginRequest.getFirstName(),
                googleLoginRequest.getLastName(),
                googleLoginRequest.getProfilePicture()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("userId", user.getId());
            response.put("token", "your-jwt-token"); // Replace with actual JWT generation

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User updatedUser, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            User user = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            userService.deleteUser(userId);
            return ResponseEntity.ok("Profile deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/user/{userId}/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @PathVariable String targetUserId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            userService.followUser(userId, targetUserId);
            return ResponseEntity.ok("Successfully followed user");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/user/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String targetUserId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            userService.unfollowUser(userId, targetUserId);
            return ResponseEntity.ok("Successfully unfollowed user");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String username, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            List<User> users = userService.searchUsersByUsername(username);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            List<User> followers = userService.getFollowers(userId);
            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String userId, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            List<User> following = userService.getFollowing(userId);
            return ResponseEntity.ok(following);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class LoginRequest {
        private String userIdentifier;
        private String password;

        public String getUserIdentifier() { return userIdentifier; }
        public void setUserIdentifier(String userIdentifier) { this.userIdentifier = userIdentifier; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class GoogleLoginRequest {
        private String googleId;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePicture;

        public String getGoogleId() { return googleId; }
        public void setGoogleId(String googleId) { this.googleId = googleId; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }
}