package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Comment;
import com.eduvibe.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment saveComment(Comment comment) {
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(new Date());
        }
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment updateComment(String id, String newText) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment != null) {
            comment.setText(newText);
            return commentRepository.save(comment);
        }
        return null;
    }
    

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }
}
