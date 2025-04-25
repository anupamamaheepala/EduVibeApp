package com.eduvibe.backend.controller;

import com.eduvibe.backend.service.DeletePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delete-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class DeletePostController {

    @Autowired
    private DeletePostService deletePostService;

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id) {
        boolean deleted = deletePostService.deletePostById(id);
        if (deleted) {
            return ResponseEntity.ok("Post deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
