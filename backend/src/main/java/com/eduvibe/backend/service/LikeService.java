package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Like;
import com.eduvibe.backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public Like toggleLike(String postId, String userId, String username) {
        Like existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existingLike != null) {
            // Unlike: remove the like
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            return null;
        } else {
            // Like: create a new like
            Like like = new Like(postId, userId, username);
            return likeRepository.save(like);
        }
    }

    public long getLikeCount(String postId) {
        return likeRepository.findByPostId(postId).size();
    }

    public boolean isLikedByUser(String postId, String userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId) != null;
    }
}