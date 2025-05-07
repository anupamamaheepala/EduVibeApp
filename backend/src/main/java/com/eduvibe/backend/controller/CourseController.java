package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.Course;
import com.eduvibe.backend.model.Chapter;
import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.CourseService;
import com.eduvibe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest) {
        try {
            if (courseRequest == null || courseRequest.getUserId() == null || courseRequest.getUserId().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }
            if (courseRequest.getName() == null || courseRequest.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course name is required");
            }
            if (courseRequest.getDescription() == null || courseRequest.getDescription().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course description is required");
            }
            if (courseRequest.getChapters() == null || courseRequest.getChapters().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("At least one chapter is required");
            }

            Course course = new Course();
            course.setName(courseRequest.getName().trim());
            course.setDescription(courseRequest.getDescription().trim());
            course.setChapters(courseRequest.getChapters());
            course.setCreatedBy(courseRequest.getUserId());

            Course savedCourse = courseService.saveCourse(course, courseRequest.getUserId());
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        List<CourseResponse> courseResponses = courses.stream().map(course -> {
            CourseResponse response = new CourseResponse();
            response.setId(course.getId());
            response.setName(course.getName());
            response.setDescription(course.getDescription());
            response.setChapters(course.getChapters());
            response.setCreatedAt(course.getCreatedAt());
            response.setCreatedBy(course.getCreatedBy());
            try {
                User user = userService.getUserById(course.getCreatedBy());
                response.setUsername(user.getUsername());
            } catch (Exception e) {
                response.setUsername("Unknown");
            }
            return response;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(courseResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        try {
            Course course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCoursesByUser(@PathVariable String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }
            User user = userService.getUserById(userId);
            List<Course> userCourses = courseService.getCoursesByUserId(userId);
            List<CourseResponse> courseResponses = userCourses.stream().map(course -> {
                CourseResponse response = new CourseResponse();
                response.setId(course.getId());
                response.setName(course.getName());
                response.setDescription(course.getDescription());
                response.setChapters(course.getChapters());
                response.setCreatedAt(course.getCreatedAt());
                response.setCreatedBy(course.getCreatedBy());
                response.setUsername(user.getUsername());
            }).collect(Collectors.toList());
            return ResponseEntity.ok(courseResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseUpdateRequest updateRequest,
            @RequestHeader("X-User-Id") String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }
            if (courseId == null || courseId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID is required");
            }
            Course updatedCourse = courseService.updateCourse(courseId, updateRequest, userId);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else if (message.contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable String courseId,
            @RequestHeader("X-User-Id") String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }
            if (courseId == null || courseId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID is required");
            }
            courseService.deleteCourse(courseId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else if (message.contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        }
    }

    // Inner class for course creation request payload
    public static class CourseRequest {
        private String userId;
        private String username;
        private String name;
        private String description;
        private List<Chapter> chapters;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<Chapter> getChapters() { return chapters; }
        public void setChapters(List<Chapter> chapters) { this.chapters = chapters; }
    }

    // Inner class for course update request payload
    public static class CourseUpdateRequest {
        private String name;
        private String description;
        private List<Chapter> chapters;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<Chapter> getChapters() { return chapters; }
        public void setChapters(List<Chapter> chapters) { this.chapters = chapters; }
    }

    // Inner class for course response to include username
    public static class CourseResponse {
        private String id;
        private String name;
        private String description;
        private List<Chapter> chapters;
        private Date createdAt;
        private String createdBy;
        private String username;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<Chapter> getChapters() { return chapters; }
        public void setChapters(List<Chapter> chapters) { this.chapters = chapters; }
        public Date getCreatedAt() { return createdAt; }
        public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }
}