package com.eduvibe.backend.service;
import com.eduvibe.backend.repository.AddPostRepository;

import com.eduvibe.backend.dto.EditPostRequest;
import com.eduvibe.backend.model.AddPost;
//import com.eduvibe.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EditPostService {

@Autowired
private AddPostRepository postRepository;


    public AddPost updatePost(String id, EditPostRequest editPostRequest) {
        Optional<AddPost> optionalPost = postRepository.findById(id);

        if (optionalPost.isPresent()) {
            AddPost post = optionalPost.get();
            post.setContent(editPostRequest.getContent());
            post.setMediaUrls(editPostRequest.getMediaUrls());
            post.setMediaTypes(editPostRequest.getMediaTypes());

            return postRepository.save(post);
        }
        return null;
    }

    public AddPost getPostById(String id) {
        return postRepository.findById(id).orElse(null);
    }
}
