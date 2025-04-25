package com.eduvibe.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eduvibe.backend.model.Post;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    // Custom method to find posts by user ID
    List<Post> findByUserId(String userId);
}
