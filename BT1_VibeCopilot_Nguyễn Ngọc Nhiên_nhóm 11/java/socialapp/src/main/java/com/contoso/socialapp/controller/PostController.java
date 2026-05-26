package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Operations related to posts")
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "List posts")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    @Operation(summary = "Create a new post")
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostCreateRequest request) {
        PostResponse post = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get a post by ID")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String postId) {
        PostResponse post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    @PatchMapping("/{postId}")
    @Operation(summary = "Update a post")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String postId,
            @Valid @RequestBody PostUpdateRequest request) {
        PostResponse post = postService.updatePost(postId, request);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a post")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}
