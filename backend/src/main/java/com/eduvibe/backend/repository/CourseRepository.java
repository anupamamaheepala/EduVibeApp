package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
    // Add custom queries if needed, e.g., find by course name
}