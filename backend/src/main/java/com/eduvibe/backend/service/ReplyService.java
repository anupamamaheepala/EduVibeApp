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
}