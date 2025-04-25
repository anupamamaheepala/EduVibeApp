package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.service.EditPostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/edit-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class EditPostController {

    @Autowired
    private EditPostService editPostService;

    @PutMapping("/{id}")
    public ResponseEntity<AddPost> updatePost(@PathVariable String id, @RequestBody AddPost updatedPost) {
        AddPost post = editPostService.updatePost(id, updatedPost);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
