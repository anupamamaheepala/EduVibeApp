package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.CourseProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CourseProgressRepository extends MongoRepository<CourseProgress, String> {
    Optional<CourseProgress> findByUserIdAndCourseId(String userId, String courseId);
}