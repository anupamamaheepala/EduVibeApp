package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.service.ViewPostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/view-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class ViewPostController {

    @Autowired
    private ViewPostService viewPostService;

    @GetMapping("/{id}")
    public ResponseEntity<AddPost> getPostById(@PathVariable String id) {
        AddPost post = viewPostService.getPostById(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
