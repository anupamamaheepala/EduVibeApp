package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.Reply;
import com.eduvibe.backend.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "http://localhost:3000")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @PostMapping
    public ResponseEntity<Reply> addReply(@RequestBody Reply reply) {
        Reply savedReply = replyService.saveReply(reply);
        return ResponseEntity.ok(savedReply);
    }

    @GetMapping("/comment/{parentCommentId}")
    public ResponseEntity<List<Reply>> getRepliesByComment(@PathVariable String parentCommentId) {
        return ResponseEntity.ok(replyService.getRepliesByParentCommentId(parentCommentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reply> updateReply(@PathVariable String id, @RequestBody Reply updatedReply) {
        Reply reply = replyService.updateReply(id, updatedReply.getText());
        if (reply != null) {
            return ResponseEntity.ok(reply);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable String id) {
        replyService.deleteReply(id);
        return ResponseEntity.ok().build();
    }
}