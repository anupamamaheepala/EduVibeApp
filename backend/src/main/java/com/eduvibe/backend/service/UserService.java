package com.eduvibe.backend.service;

import com.eduvibe.backend.model.User;
import com.eduvibe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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

    public User handleGoogleLogin(String googleId, String username, String email, String firstName, String lastName,
                                 String profilePicture) throws Exception {
        User user = userRepository.findByEmail(email).orElse(new User());

        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProfilePicture(profilePicture);
        if (user.getPassword() == null) {
            user.setPassword(passwordEncoder.encode("google_" + googleId));
        }

        return userRepository.save(user);
    }

    public User getUserById(String userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
    }

    public User updateUser(String userId, User updatedUser) throws Exception {
        User existingUser = getUserById(userId);

        if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().isEmpty()) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null && !updatedUser.getLastName().isEmpty()) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            if (userRepository.findByEmail(updatedUser.getEmail()).isPresent() &&
                    !updatedUser.getEmail().equals(existingUser.getEmail())) {
                throw new Exception("Email already exists");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getProfilePicture() != null && !updatedUser.getProfilePicture().isEmpty()) {
            existingUser.setProfilePicture(updatedUser.getProfilePicture());
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(String userId) throws Exception {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

    public void followUser(String userId, String targetUserId) throws Exception {
        if (userId.equals(targetUserId)) {
            throw new Exception("Cannot follow yourself");
        }
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);

        if (!user.getFollowing().contains(targetUserId)) {
            user.getFollowing().add(targetUserId);
            targetUser.getFollowers().add(userId);
            userRepository.save(user);
            userRepository.save(targetUser);
        }
    }

    public void unfollowUser(String userId, String targetUserId) throws Exception {
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);

        if (user.getFollowing().contains(targetUserId)) {
            user.getFollowing().remove(targetUserId);
            targetUser.getFollowers().remove(userId);
            userRepository.save(user);
            userRepository.save(targetUser);
        }
    }

    public List<User> searchUsersByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    public List<User> getFollowers(String userId) throws Exception {
        User user = getUserById(userId);
        return userRepository.findAllById(user.getFollowers());
    }

    public List<User> getFollowing(String userId) throws Exception {
        User user = getUserById(userId);
        return userRepository.findAllById(user.getFollowing());
    }

    public void addCourseToUser(String userId, String courseId) throws Exception {
        User user = getUserById(userId);
        if (!user.getCourses().contains(courseId)) {
            user.getCourses().add(courseId);
            userRepository.save(user);
        }
    }

    public void removeCourseFromUser(String userId, String courseId) throws Exception {
        User user = getUserById(userId);
        if (user.getCourses().contains(courseId)) {
            user.getCourses().remove(courseId);
            userRepository.save(user);
        }
    }

    public void enrollInCourse(String userId, String courseId) throws Exception {
        User user = getUserById(userId);
        if (!user.getEnrolledCourses().contains(courseId)) {
            user.getEnrolledCourses().add(courseId);
            userRepository.save(user);
        }
    }

    public List<String> getEnrolledCourses(String userId) throws Exception {
        User user = getUserById(userId);
        return user.getEnrolledCourses();
    }
}