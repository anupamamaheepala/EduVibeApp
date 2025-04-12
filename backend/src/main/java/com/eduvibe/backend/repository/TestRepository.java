package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.TestEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<TestEntity, String> {
}