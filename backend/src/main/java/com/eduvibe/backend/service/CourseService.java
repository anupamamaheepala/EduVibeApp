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

    public Course saveCourse(Course course) {
        // Debug logs
        System.out.println("Creating Course:");
        System.out.println("Name: " + course.getName());
        System.out.println("Description: " + course.getDescription());
        System.out.println("Chapters: " + course.getChapters());

        // Validation
        if (course.getName() == null || course.getName().isEmpty()) {
            throw new IllegalArgumentException("Course name is required");
        }
        if (course.getDescription() == null || course.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Course description is required");
        }
        if (course.getChapters() == null || course.getChapters().isEmpty()) {
            throw new IllegalArgumentException("At least one chapter is required");
        }

        // Set createdAt if not set (optional, if you add a createdAt field to Course model)
        // if (course.getCreatedAt() == null) {
        //     course.setCreatedAt(new Date());
        // }

        Course saved = courseRepository.save(course);
        System.out.println("Saved Course ID: " + saved.getId());
        return saved;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + id));
    }
}