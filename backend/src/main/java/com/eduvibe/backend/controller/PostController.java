package com.eduvibe.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduvibe.backend.model.Post;
import com.eduvibe.backend.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.savePost(post);
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }

    // 🆕 Get posts by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> userPosts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(userPosts);
    }
}
