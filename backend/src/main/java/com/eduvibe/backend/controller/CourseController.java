package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.Course;
import com.eduvibe.backend.model.Chapter;
import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.CourseService;
import com.eduvibe.backend.service.EditCourseService;
import com.eduvibe.backend.service.DeleteCourseService;
import com.eduvibe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private EditCourseService editCourseService;

    @Autowired
    private DeleteCourseService deleteCourseService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody CourseRequest courseRequest) {
        System.out.println("Creating Course:");
        System.out.println("UserId: " + courseRequest.getUserId());
        System.out.println("Username: " + courseRequest.getUsername());
        System.out.println("Name: " + courseRequest.getName());
        System.out.println("Description: " + courseRequest.getDescription());
        System.out.println("Chapters: " + courseRequest.getChapters());

        Course course = new Course();
        course.setName(courseRequest.getName());
        course.setDescription(courseRequest.getDescription());
        course.setChapters(courseRequest.getChapters());
        course.setCreatedBy(courseRequest.getUserId());

        Course savedCourse = courseService.saveCourse(course, courseRequest.getUserId());
        return ResponseEntity.ok(savedCourse);
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
        // Fetch username from UserRepository
        User user = userRepository.findById(course.getCreatedBy()).orElse(null);
        response.setUsername(user != null ? user.getUsername() : "Unknown");
        return response;
    }).collect(Collectors.toList());
    return ResponseEntity.ok(courseResponses);
}

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
        Course updatedCourse = editCourseService.updateCourse(id, course);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        deleteCourseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByUser(@PathVariable String userId) {
        System.out.println("Fetching courses for user ID: " + userId); // Add logging
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.out.println("User not found for ID: " + userId); // Log user not found
                    return new IllegalArgumentException("User not found with ID: " + userId);
                });
    
        List<Course> userCourses = courseService.getCoursesByUserId(userId);

        System.out.println("Found courses: " + userCourses.size()); // Log number of courses
        
        List<CourseResponse> courseResponses = userCourses.stream().map(course -> {
            CourseResponse response = new CourseResponse();
            response.setId(course.getId());
            response.setName(course.getName());
            response.setDescription(course.getDescription());
            response.setChapters(course.getChapters());
            response.setCreatedAt(course.getCreatedAt());
            response.setCreatedBy(course.getCreatedBy());
            response.setUsername(user.getUsername());
            return response;
        }).collect(Collectors.toList());
    
        return ResponseEntity.ok(courseResponses);
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