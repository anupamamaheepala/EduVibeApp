package com.eduvibe.backend.service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.model.Comment;
import com.eduvibe.backend.model.Reply;
import com.eduvibe.backend.model.Notification;
import com.eduvibe.backend.repository.AddPostRepository;
import com.eduvibe.backend.repository.CommentRepository;
import com.eduvibe.backend.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired 
    private AddPostRepository addPostRepository;

    @Autowired
    private NotificationService notificationService;

    public Comment saveComment(Comment comment) {
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(new Date());
        }
        Comment savedComment = commentRepository.save(comment);

        // Create a notification for the post owner
        AddPost post = addPostRepository.findById(comment.getPostId()).orElse(null);
        if (post != null && !post.getUsername().equals(comment.getUsername())) {
            Notification notification = new Notification(
                comment.getPostId(),
                post.getUsername(), 
                comment.getUsername(), 
                "comment",
                comment.getUsername() + " commented on your post",
                new Date(),
                false
            );
            notificationService.saveNotification(notification);
        }

        return savedComment;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        for (Comment comment : comments) {
            if (comment.getCreatedAt() == null) {
                comment.setCreatedAt(new Date());
                commentRepository.save(comment);
            }
            // Fetch replies for each comment
            List<Reply> replies = replyRepository.findByParentCommentId(comment.getId());
            comment.setReplies(replies);
        }
        return comments;
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
        // Delete associated replies
        List<Reply> replies = replyRepository.findByParentCommentId(id);
        replyRepository.deleteAll(replies);
        // Delete the comment
        commentRepository.deleteById(id);
    }
}