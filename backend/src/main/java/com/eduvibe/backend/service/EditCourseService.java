package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Course;
import com.eduvibe.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EditCourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course updateCourse(String id, Course updatedCourse) {
        // Debug logs
        System.out.println("Updating Course ID: " + id);
        System.out.println("New Name: " + updatedCourse.getName());
        System.out.println("New Description: " + updatedCourse.getDescription());
        System.out.println("New Chapters: " + updatedCourse.getChapters());

        // Check if course exists
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + id));

        // Update fields
        existingCourse.setName(updatedCourse.getName());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setChapters(updatedCourse.getChapters());

        // Save updated course
        Course saved = courseRepository.save(existingCourse);
        System.out.println("Updated Course ID: " + saved.getId());
        return saved;
    }
}