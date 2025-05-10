package com.eduvibe.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.repository.AddPostRepository;

import java.util.Date;
import java.util.List;

@Service
public class AddPostService {

    @Autowired
    private AddPostRepository addPostRepository;

    // public AddPost savePost(AddPost post) {
    //     // Debug logs — check if mediaUrl is received
    //     System.out.println("Creating Post:");
    //     System.out.println("UserId: " + post.getUserId());
    //     System.out.println("Username: " + post.getUsername());
    //     System.out.println("Content: " + post.getContent());
    //     System.out.println("Media URL: " + post.getMediaUrl());
    //     System.out.println("Media Type: " + post.getMediaType());

    //     // Set createdAt only if not set
    //     if (post.getCreatedAt() == null) {
    //         post.setCreatedAt(new Date());
    //     }

    //     AddPost saved = addPostRepository.save(post);
    //     System.out.println("Saved Post ID: " + saved.getId());
    //     return saved;
    // }

        public AddPost savePost(AddPost post) {
        System.out.println("Saving Post:");
        System.out.println("UserId: " + post.getUserId());
        System.out.println("Username: " + post.getUsername());
        System.out.println("Content: " + post.getContent());
        System.out.println("Media URLs: " + post.getMediaUrls()); // Updated
        System.out.println("Media Types: " + post.getMediaTypes());

        if (post.getCreatedAt() == null) {
            post.setCreatedAt(new Date());
        }

        return addPostRepository.save(post);
    }

    public AddPost repostPost(String postId, String userId, String username) {
        AddPost original = addPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Original post not found"));

        AddPost repost = new AddPost();
        repost.setUserId(userId);
        repost.setUsername(username);
        repost.setContent(original.getContent());
        repost.setMediaUrls(original.getMediaUrls());
        repost.setMediaTypes(original.getMediaTypes());
        repost.setCreatedAt(new Date());
        repost.setRepostOfPostId(original.getId()); // 💡 store original post ID

        return addPostRepository.save(repost);
    }


    // public List<AddPost> getAllPosts() {
    //     return addPostRepository.findAll();
    // }
    public List<AddPost> getAllPosts() {
    List<AddPost> posts = addPostRepository.findAll();

    for (AddPost post : posts) {
        if (post.getRepostOfPostId() != null) {
            addPostRepository.findById(post.getRepostOfPostId()).ifPresent(post::setRepostOfPost);
        }
    }

    return posts;
}

    public void deletePost(String id) {
        addPostRepository.deleteById(id);
    }

    public List<AddPost> getPostsByUserId(String userId) {
        return addPostRepository.findByUserId(userId);
    }
}
