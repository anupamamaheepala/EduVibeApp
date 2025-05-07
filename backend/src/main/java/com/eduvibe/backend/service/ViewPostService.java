package com.eduvibe.backend.service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViewPostService {

    @Autowired
    private AddPostRepository addPostRepository;

    public AddPost getPostById(String id) {
        return addPostRepository.findById(id).orElse(null);
    }

    // ✅ Add this method to get posts by user ID
    public List<AddPost> getPostsByUserId(String userId) {
        return addPostRepository.findByUserId(userId);
    }
}
