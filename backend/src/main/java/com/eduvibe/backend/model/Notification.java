package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String postId; // ID of the post being commented on
    private String ownerUsername; // Username of the post owner
    private String commenterUsername; // Username of the person who commented
    private String type; // e.g., "comment"
    private String content; // Notification message
    private Date createdAt;
    private boolean read; // Whether the notification has been read

    public Notification() {}

    public Notification(String postId, String ownerUsername, String commenterUsername, String type, String content, Date createdAt, boolean read) {
        this.postId = postId;
        this.ownerUsername = ownerUsername;
        this.commenterUsername = commenterUsername;
        this.type = type;
        this.content = content;
        this.createdAt = createdAt;
        this.read = read;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getCommenterUsername() { return commenterUsername; }
    public void setCommenterUsername(String commenterUsername) { this.commenterUsername = commenterUsername; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}