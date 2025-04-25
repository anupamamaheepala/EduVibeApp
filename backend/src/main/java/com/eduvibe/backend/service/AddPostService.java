package com.eduvibe.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;

import java.util.List;

@Service
public class AddPostService {

    @Autowired
    private AddPostRepository AddpostRepository;

    public AddPost savePost(AddPost Addpost) {
        return AddpostRepository.save(Addpost);
    }

    public List<AddPost> getAllPosts() {
        return AddpostRepository.findAll();
    }

    public void deletePost(String id) {
        AddpostRepository.deleteById(id);
    }

    public List<AddPost> getPostsByUserId(String userId) {
        return AddpostRepository.findByUserId(userId);
    }

}
