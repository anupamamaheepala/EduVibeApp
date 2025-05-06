package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SharedPostRepository extends MongoRepository<SharedPost, String> {
    List<SharedPost> findByToUserIdsContaining(String userId);
}
