package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByCreatorId(String creatorId);
    List<Group> findByMemberIdsContaining(String userId);
}