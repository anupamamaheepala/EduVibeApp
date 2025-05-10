package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Reply;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReplyRepository extends MongoRepository<Reply, String> {
    List<Reply> findByParentCommentId(String parentCommentId);
}