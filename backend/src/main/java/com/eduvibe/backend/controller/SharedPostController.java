// package com.eduvibe.backend.controller;

// import com.eduvibe.backend.model.SharedPost;
// import com.eduvibe.backend.service.SharedPostService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/shared-posts")
// @CrossOrigin(origins = "http://localhost:3000") // allow frontend access
// public class SharedPostController {

//     @Autowired
//     private SharedPostService sharedPostService;

//     // POST /api/shared-posts/share
//     @PostMapping("/share")
//     public ResponseEntity<SharedPost> sharePost(@RequestBody SharedPost sharedPost) {
//         SharedPost saved = sharedPostService.saveSharedPost(sharedPost);
//         return ResponseEntity.ok(saved);
//     }

//     // GET /api/shared-posts/user/{userId}
//     @GetMapping("/user/{userId}")
//     public ResponseEntity<List<SharedPost>> getSharedPostsForUser(@PathVariable String userId) {
//         List<SharedPost> sharedPosts = sharedPostService.getPostsSharedWithUser(userId);
//         return ResponseEntity.ok(sharedPosts);
//     }
    
// }



package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.SharedPost;
import com.eduvibe.backend.model.User;
import com.eduvibe.backend.service.SharedPostService;
import com.eduvibe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shared-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class SharedPostController {

    @Autowired
    private SharedPostService sharedPostService;

    @Autowired
    private UserService userService;

    @PostMapping("/share")
public ResponseEntity<SharedPost> sharePost(@RequestBody SharedPost sharedPost) {
    try {
        // Look up the user name
        User fromUser = userService.getUserById(sharedPost.getFromUserId());
        sharedPost.setfromName(fromUser.getUsername()); // Set the name manually

        SharedPost saved = sharedPostService.saveSharedPost(sharedPost);
        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(null);
    }
}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getSharedPostsForUser(@PathVariable String userId) {
        List<SharedPost> sharedPosts = sharedPostService.getPostsSharedWithUser(userId);

        List<Map<String, Object>> enriched = sharedPosts.stream().map(sp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sp.getId());
            map.put("postId", sp.getPostId());
            map.put("fromUserId", sp.getFromUserId());
            map.put("toUserIds", sp.getToUserIds());
            map.put("sharedAt", sp.getSharedAt());

            try {
                User fromUser = userService.getUserById(sp.getFromUserId());
                map.put("fromName", fromUser.getUsername()); // 💡 Add name here
            } catch (Exception e) {
                map.put("fromName", "Unknown");
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(enriched);
    }
}
