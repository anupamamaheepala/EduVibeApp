package com.eduvibe.backend.service;

import com.eduvibe.backend.repository.AddPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeletePostService {

    @Autowired
    private AddPostRepository addPostRepository;

    public boolean deletePostById(String id) {
        if (addPostRepository.existsById(id)) {
            addPostRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
