package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.Like;
import com.eduvibe.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "http://localhost:3000")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<Like> toggleLike(@RequestParam String postId, @RequestParam String userId, @RequestParam String username) {
        Like like = likeService.toggleLike(postId, userId, username);
        if (like != null) {
            return ResponseEntity.ok(like);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable String postId) {
        return ResponseEntity.ok(likeService.getLikeCount(postId));
    }

    @GetMapping("/is-liked")
    public ResponseEntity<Boolean> isLikedByUser(@RequestParam String postId, @RequestParam String userId) {
        return ResponseEntity.ok(likeService.isLikedByUser(postId, userId));
    }
}