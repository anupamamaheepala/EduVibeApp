package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Course;
import com.eduvibe.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserService userService;
    public Course saveCourse(Course course, String userId) {
        System.out.println("Creating Course:");
        System.out.println("Name: " + course.getName());
        System.out.println("Description: " + course.getDescription());
        System.out.println("Chapters: " + course.getChapters());
        System.out.println("Created By User ID: " + userId);
    
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (course.getName() == null || course.getName().isEmpty()) {
            throw new IllegalArgumentException("Course name is required");
        }
        if (course.getDescription() == null || course.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Course description is required");
        }
        if (course.getChapters() == null || course.getChapters().isEmpty()) {
            throw new IllegalArgumentException("At least one chapter is required");
        }
    
        course.setCreatedBy(userId);
        course.setCreatedAt(new Date());
    
        Course saved = courseRepository.save(course);
        System.out.println("Saved course: " + saved.getId() + ", createdBy: " + saved.getCreatedBy());
        userService.addCourseToUser(userId, saved.getId());
    
        return saved;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + id));
    }

    public List<Course> getCoursesByUserId(String userId) {
        System.out.println("Fetching courses for user ID: " + userId);
        List<Course> courses = courseRepository.findByCreatedBy(userId);
        System.out.println("Found " + courses.size() + " courses for user ID: " + userId);
        return courses;
    }
}