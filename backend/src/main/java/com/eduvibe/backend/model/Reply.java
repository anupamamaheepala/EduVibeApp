package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "replies")
public class Reply {

    @Id
    private String id;
    private String userId;
    private String username;
    private String text;
    private Date createdAt;
    private String parentCommentId;

    public Reply() {}

    public Reply(String userId, String username, String text, Date createdAt, String parentCommentId) {
        this.userId = userId;
        this.username = username;
        this.text = text;
        this.createdAt = createdAt;
        this.parentCommentId = parentCommentId;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(String parentCommentId) { this.parentCommentId = parentCommentId; }
}