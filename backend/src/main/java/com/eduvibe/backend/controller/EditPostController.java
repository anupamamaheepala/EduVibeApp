package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.service.EditPostService;
import com.eduvibe.backend.model.EditPostRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class EditPostController {

    @Autowired
    private EditPostService editPostService;

    // ✅ Updated PUT method to accept JSON
    @PutMapping("/edit-post/{id}")
    public ResponseEntity<AddPost> updatePost(
            @PathVariable String id,
            @RequestBody EditPostRequest editPostRequest // JSON body
    ) {
        AddPost post = editPostService.updatePost(id, editPostRequest);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Existing GET method stays the same
    @GetMapping("/edit-post/{id}")
    public ResponseEntity<AddPost> getPostById(@PathVariable String id) {
        AddPost post = editPostService.getPostById(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
