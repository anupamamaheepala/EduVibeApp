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
}