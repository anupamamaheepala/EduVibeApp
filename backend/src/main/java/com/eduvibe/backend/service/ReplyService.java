package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Comment;
import com.eduvibe.backend.model.Notification;
import com.eduvibe.backend.model.Reply;
import com.eduvibe.backend.repository.CommentRepository;
import com.eduvibe.backend.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CommentRepository commentRepository;

    public Reply saveReply(Reply reply) {
        if (reply.getCreatedAt() == null) {
            reply.setCreatedAt(new Date());
        }
        Reply savedReply = replyRepository.save(reply);

        // Create a notification for the parent comment's owner
        Comment parentComment = commentRepository.findById(reply.getParentCommentId()).orElse(null);
        if (parentComment != null && !parentComment.getUsername().equals(reply.getUsername())) {
            Notification notification = new Notification();
            notification.setPostId(parentComment.getPostId()); 
            notification.setOwnerUsername(parentComment.getUsername()); 
            notification.setCommenterUsername(reply.getUsername()); 
            notification.setType("reply");
            notification.setContent(reply.getUsername() + " replied to your comment: " + reply.getText());
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationService.saveNotification(notification);
        }

        return savedReply;
    }

    public List<Reply> getRepliesByParentCommentId(String parentCommentId) {
        return replyRepository.findByParentCommentId(parentCommentId);
    }

    public Reply updateReply(String id, String newText) {
        Reply reply = replyRepository.findById(id).orElse(null);
        if (reply != null) {
            reply.setText(newText);
            return replyRepository.save(reply);
        }
        return null;
    }

    public void deleteReply(String id) {
        replyRepository.deleteById(id);
    }
}