package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    Like findByPostIdAndUserId(String postId, String userId);
    void deleteByPostIdAndUserId(String postId, String userId);
}