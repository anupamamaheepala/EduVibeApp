package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.time.LocalDateTime;

@Document(collection = "shared_posts")
public class SharedPost {

    @Id
    private String id;

    private String postId;
    private String fromUserId;
     private List<String> toUserIds;
    private LocalDateTime sharedAt = LocalDateTime.now();

    // Getters and setters
    public String getId() { return id; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

    public List<String> getToUserIds() { return toUserIds; }
    public void setToUserIds(List<String> toUserIds) { this.toUserIds = toUserIds; }

    public LocalDateTime getSharedAt() { return sharedAt; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
}
