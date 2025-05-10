package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Reply;
import com.eduvibe.backend.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    public Reply saveReply(Reply reply) {
        if (reply.getCreatedAt() == null) {
            reply.setCreatedAt(new Date());
        }
        return replyRepository.save(reply);
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