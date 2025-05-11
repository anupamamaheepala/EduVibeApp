package com.eduvibe.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eduvibe.backend.model.AddPost;

import java.util.List;

public interface AddPostRepository extends MongoRepository<AddPost, String> {
    // find posts by user ID
    List<AddPost> findByUserId(String userId);
}
