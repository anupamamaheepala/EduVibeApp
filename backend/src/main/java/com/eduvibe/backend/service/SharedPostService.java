package com.eduvibe.backend.service;

import com.eduvibe.backend.model.SharedPost;
import com.eduvibe.backend.repository.SharedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SharedPostService {

    @Autowired
    private SharedPostRepository sharedPostRepository;


    public SharedPost saveSharedPost(SharedPost post) {
        return sharedPostRepository.save(post);
    }


    public List<SharedPost> getPostsSharedWithUser(String userId) {
        return sharedPostRepository.findByToUserIdsContaining(userId);
        
    }
}
