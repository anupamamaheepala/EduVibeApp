package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.SharedPost;
import com.eduvibe.backend.service.SharedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shared-posts")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend access
public class SharedPostController {

    @Autowired
    private SharedPostService sharedPostService;

    // POST /api/shared-posts/share
    @PostMapping("/share")
    public ResponseEntity<SharedPost> sharePost(@RequestBody SharedPost sharedPost) {
        SharedPost saved = sharedPostService.saveSharedPost(sharedPost);
        return ResponseEntity.ok(saved);
    }

    // GET /api/shared-posts/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SharedPost>> getSharedPostsForUser(@PathVariable String userId) {
        List<SharedPost> sharedPosts = sharedPostService.getPostsSharedWithUser(userId);
        return ResponseEntity.ok(sharedPosts);
    }
    
}
