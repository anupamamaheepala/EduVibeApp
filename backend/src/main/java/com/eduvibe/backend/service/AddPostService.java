package com.eduvibe.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;

import java.util.Date;
import java.util.List;

@Service
public class AddPostService {

    @Autowired
    private AddPostRepository addPostRepository;

    public AddPost savePost(AddPost post) {
        // Debug logs — check if mediaUrl is received
        System.out.println("Creating Post:");
        System.out.println("UserId: " + post.getUserId());
        System.out.println("Username: " + post.getUsername());
        System.out.println("Content: " + post.getContent());
        System.out.println("Media URL: " + post.getMediaUrl());
        System.out.println("Media Type: " + post.getMediaType());

        // Set createdAt only if not set
        if (post.getCreatedAt() == null) {
            post.setCreatedAt(new Date());
        }

        AddPost saved = addPostRepository.save(post);
        System.out.println("Saved Post ID: " + saved.getId());
        return saved;
    }

    public List<AddPost> getAllPosts() {
        return addPostRepository.findAll();
    }

    public void deletePost(String id) {
        addPostRepository.deleteById(id);
    }

    public List<AddPost> getPostsByUserId(String userId) {
        return addPostRepository.findByUserId(userId);
    }
}
