package com.eduvibe.backend.model;
import java.util.List;
import java.util.Date; // ✅ Required
import org.springframework.data.annotation.Id; // ✅ Required
import org.springframework.data.mongodb.core.mapping.Document; // ✅ Required
import org.springframework.data.annotation.Transient;

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
    private String repostOfPostId;
    private String repostUsername;
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
@Transient
private AddPost repostOfPost;
    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public List<String> getMediaTypes() { return mediaTypes; }
    public void setMediaTypes(List<String> mediaTypes) { this.mediaTypes = mediaTypes; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getRepostOfPostId() {return repostOfPostId;}
    public void setRepostOfPostId(String repostOfPostId) {this.repostOfPostId = repostOfPostId;}

    public AddPost getRepostOfPost() {return repostOfPost;}
    public void setRepostOfPost(AddPost repostOfPost) {this.repostOfPost = repostOfPost;}

    public String getRepostUsername() {return repostUsername;}
    public void setRepostUsername(String repostUsername) {this.repostUsername = repostUsername;}
}
