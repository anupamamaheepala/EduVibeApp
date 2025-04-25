package com.eduvibe.backend.model;

import java.util.Date; // ✅ Required
import org.springframework.data.annotation.Id; // ✅ Required
import org.springframework.data.mongodb.core.mapping.Document; // ✅ Required

@Document(collection = "posts")
public class AddPost {

    @Id
    private String id;

    private String userId;
    private String username;
    private String content;
    private String mediaUrl;
    private String mediaType;
    private Date createdAt;

    public AddPost() {}

    public AddPost(String userId, String username, String content, String mediaUrl, String mediaType, Date createdAt) {
        this.userId = userId;
        this.username = username;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
