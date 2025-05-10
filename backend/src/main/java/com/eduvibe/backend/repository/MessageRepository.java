package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupIdOrderByTimestampAsc(String groupId);
}