package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;
import com.eduvibe.backend.service.ViewPostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/view-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class ViewPostController {

    @Autowired
    private ViewPostService viewPostService;

    @Autowired
    private AddPostRepository addPostRepository; // ✅ Inject the repository

    @GetMapping("/{id}")
    public ResponseEntity<AddPost> getPostById(@PathVariable String id) {
        AddPost post = viewPostService.getPostById(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Get all posts
    @GetMapping
    public ResponseEntity<List<AddPost>> getAllPosts() {
        List<AddPost> posts = addPostRepository.findAll();
        return ResponseEntity.ok(posts);
    }

    // ✅ Get posts by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddPost>> getPostsByUser(@PathVariable String userId) {
        List<AddPost> posts = viewPostService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
}
