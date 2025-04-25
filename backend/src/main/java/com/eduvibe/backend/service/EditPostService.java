package com.eduvibe.backend.service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EditPostService {

    @Autowired
    private AddPostRepository addPostRepository;

    public AddPost updatePost(String id, AddPost updatedPost) {
        Optional<AddPost> existingPostOptional = addPostRepository.findById(id);
        if (existingPostOptional.isPresent()) {
            AddPost existingPost = existingPostOptional.get();

            // Update fields
            existingPost.setContent(updatedPost.getContent());
            existingPost.setMediaUrl(updatedPost.getMediaUrl());
            existingPost.setMediaType(updatedPost.getMediaType());
            existingPost.setCreatedAt(updatedPost.getCreatedAt()); // Optional: consider keeping original timestamp

            return addPostRepository.save(existingPost);
        } else {
            return null;
        }
    }
}
