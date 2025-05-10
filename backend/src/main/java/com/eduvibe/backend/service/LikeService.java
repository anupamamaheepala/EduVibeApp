package com.eduvibe.backend.service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.model.Like;
import com.eduvibe.backend.model.Notification;
import com.eduvibe.backend.repository.AddPostRepository;
import com.eduvibe.backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private AddPostRepository addPostRepository;

    @Autowired
    private NotificationService notificationService;

    public Like toggleLike(String postId, String userId, String username) {
        Like existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existingLike != null) {
            // Unlike: remove the like
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            return null;
        } else {
            // Like: create a new like
            Like like = new Like(postId, userId, username);
            Like savedLike = likeRepository.save(like);

            // Create a notification for the post owner if the liker is not the owner
            AddPost post = addPostRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            if (!post.getUsername().equals(username)) {
                Notification notification = new Notification(
                    postId,
                    post.getUsername(), // Post owner's username
                    username, // Liker's username
                    "like",
                    username + " liked your post",
                    new Date(),
                    false
                );
                notificationService.saveNotification(notification);
            }

            return savedLike;
        }
    }

    public long getLikeCount(String postId) {
        return likeRepository.findByPostId(postId).size();
    }

    public boolean isLikedByUser(String postId, String userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId) != null;
    }
}