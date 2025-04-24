package com.eduvibe.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eduvibe.backend.model.Post;

public interface PostRepository extends MongoRepository<Post, String> {
}
