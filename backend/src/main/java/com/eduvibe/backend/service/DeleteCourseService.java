package com.eduvibe.backend.service;

import com.eduvibe.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteCourseService {

    @Autowired
    private CourseRepository courseRepository;

    public void deleteCourse(String id) {
        // Debug logs
        System.out.println("Deleting Course ID: " + id);

        // Check if course exists
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course not found with ID: " + id);
        }

        courseRepository.deleteById(id);
        System.out.println("Deleted Course ID: " + id);
    }
}