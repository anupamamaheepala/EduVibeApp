package com.eduvibe.backend.model;
import java.util.List;

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
    // private String mediaUrl;
    // private String mediaType;
    private List<String> mediaUrls; // ⬅️ Change here to List
    private List<String> mediaTypes; // ⬅️ Optional: media type for each media
    private Date createdAt;

    public AddPost() {}

    public AddPost(String userId, String username, String content, List<String> mediaUrls, List<String> mediaTypes, Date createdAt) {  //String mediaUrl, String mediaType
        this.userId = userId;
        this.username = username;
        this.content = content;
        // this.mediaUrl = mediaUrl;
        // this.mediaType = mediaType;
        this.mediaUrls = mediaUrls;
        this.mediaTypes = mediaTypes;
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

    // public String getMediaUrl() { return mediaUrl; }
    // public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    // public String getMediaType() { return mediaType; }
    // public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public List<String> getMediaTypes() { return mediaTypes; }
    public void setMediaTypes(List<String> mediaTypes) { this.mediaTypes = mediaTypes; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
