package com.eduvibe.backend.service;

import com.eduvibe.backend.controller.CourseController;
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

    public Course saveCourse(Course course, String userId) throws Exception {
        if (userId == null || userId.trim().isEmpty()) {
            throw new Exception("User ID is required");
        }
        // Validate user existence
        userService.getUserById(userId);
        
        if (course.getName() == null || course.getName().trim().isEmpty()) {
            throw new Exception("Course name is required");
        }
        if (course.getDescription() == null || course.getDescription().trim().isEmpty()) {
            throw new Exception("Course description is required");
        }
        if (course.getChapters() == null || course.getChapters().isEmpty()) {
            throw new Exception("At least one chapter is required");
        }

        course.setCreatedBy(userId);
        course.setCreatedAt(new Date());

        Course saved = courseRepository.save(course);
        userService.addCourseToUser(userId, saved.getId());

        return saved;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) throws Exception {
        return courseRepository.findById(id)
                .orElseThrow(() -> new Exception("Course not found with ID: " + id));
    }

    public List<Course> getCoursesByUserId(String userId) throws Exception {
        if (userId == null || userId.trim().isEmpty()) {
            throw new Exception("User ID is required");
        }
        // Validate user existence
        userService.getUserById(userId);
        return courseRepository.findByCreatedBy(userId);
    }

    public Course updateCourse(String courseId, CourseController.CourseUpdateRequest updateRequest, String userId) throws Exception {
        if (userId == null || userId.trim().isEmpty()) {
            throw new Exception("User ID is required");
        }
        if (courseId == null || courseId.trim().isEmpty()) {
            throw new Exception("Course ID is required");
        }

        // Validate user and course existence
        userService.getUserById(userId);
        Course course = getCourseById(courseId);

        if (!course.getCreatedBy().equals(userId)) {
            throw new Exception("You are not authorized to update this course");
        }

        // Update course fields
        if (updateRequest.getName() != null && !updateRequest.getName().trim().isEmpty()) {
            course.setName(updateRequest.getName().trim());
        }
        if (updateRequest.getDescription() != null && !updateRequest.getDescription().trim().isEmpty()) {
            course.setDescription(updateRequest.getDescription().trim());
        }
        if (updateRequest.getChapters() != null && !updateRequest.getChapters().isEmpty()) {
            course.setChapters(updateRequest.getChapters());
        }

        return courseRepository.save(course);
    }

    public void deleteCourse(String courseId, String userId) throws Exception {
        if (userId == null || userId.trim().isEmpty()) {
            throw new Exception("User ID is required");
        }
        if (courseId == null || courseId.trim().isEmpty()) {
            throw new Exception("Course ID is required");
        }

        // Validate user and course existence
        userService.getUserById(userId);
        Course course = getCourseById(courseId);

        if (!course.getCreatedBy().equals(userId)) {
            throw new Exception("You are not authorized to delete this course");
        }

        courseRepository.deleteById(courseId);
        userService.removeCourseFromUser(userId, courseId);
    }
}