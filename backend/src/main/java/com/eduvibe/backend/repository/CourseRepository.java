package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCreatedBy(String createdBy);
}