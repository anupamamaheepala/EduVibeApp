package com.eduvibe.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.service.AddPostService;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class AddPostController {

    @Autowired
    private AddPostService AddpostService;

    // Create a new post
    @PostMapping
    public AddPost createPost(@RequestBody AddPost Addpost) {
        return AddpostService.savePost(Addpost);
    }

    // Get all posts
    @GetMapping
    public List<AddPost> getAllPosts() {
        return AddpostService.getAllPosts();
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        AddpostService.deletePost(id);

    }

    // 🆕 Get posts by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddPost>> getPostsByUser(@PathVariable String userId) {
        List<AddPost> userPosts = AddpostService.getPostsByUserId(userId);
        return ResponseEntity.ok(userPosts);
    }
}
