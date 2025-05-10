// package com.eduvibe.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.eduvibe.backend.model.AddPost;
// import com.eduvibe.backend.service.AddPostService;

// import java.util.List;

// @RestController
// @RequestMapping("/api/add-post")
// @CrossOrigin(origins = "http://localhost:3000")
// public class AddPostController {

//     @Autowired
//     private AddPostService addPostService;

//     @PostMapping
//     public AddPost createPost(@RequestBody AddPost post) {
//         // CreatedAt handled in service
//         return addPostService.savePost(post);
//     }

//     @GetMapping
//     public List<AddPost> getAllPosts() {
//         return addPostService.getAllPosts();
//     }

//     @DeleteMapping("/{id}")
//     public void deletePost(@PathVariable String id) {
//         addPostService.deletePost(id);
//     }

//     @GetMapping("/user/{userId}")
//     public ResponseEntity<List<AddPost>> getPostsByUser(@PathVariable String userId) {
//         List<AddPost> userPosts = addPostService.getPostsByUserId(userId);
//         return ResponseEntity.ok(userPosts);
//     }
// }


package com.eduvibe.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduvibe.backend.model.AddPost;
import com.eduvibe.backend.service.AddPostService;

import java.util.List;
import com.eduvibe.backend.model.RepostRequest;

@RestController
@RequestMapping("/api/add-post")
@CrossOrigin(origins = "http://localhost:3000")
public class AddPostController {

    @Autowired
    private AddPostService addPostService;

    @PostMapping
    public AddPost createPost(@RequestBody AddPost post) {
        // Debugging logs to check received mediaUrls
        System.out.println("Creating Post:");
        System.out.println("UserId: " + post.getUserId());
        System.out.println("Username: " + post.getUsername());
        System.out.println("Content: " + post.getContent());
        System.out.println("Media URLs: " + post.getMediaUrls()); // List now
        System.out.println("Media Types: " + post.getMediaTypes());

        return addPostService.savePost(post);
    }

    @GetMapping
    public List<AddPost> getAllPosts() {
        return addPostService.getAllPosts();
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        addPostService.deletePost(id);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddPost>> getPostsByUser(@PathVariable String userId) {
        List<AddPost> userPosts = addPostService.getPostsByUserId(userId);
        return ResponseEntity.ok(userPosts);
    }

    @PostMapping("/repost/{postId}")
    public ResponseEntity<AddPost> repostPost(@PathVariable String postId, @RequestBody RepostRequest request) {
        AddPost repost = addPostService.repostPost(postId, request.getUserId(), request.getUsername());
        return ResponseEntity.ok(repost);
    }

}
