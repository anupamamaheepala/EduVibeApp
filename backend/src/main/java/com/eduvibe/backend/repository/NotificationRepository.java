package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByOwnerUsername(String ownerUsername);
}