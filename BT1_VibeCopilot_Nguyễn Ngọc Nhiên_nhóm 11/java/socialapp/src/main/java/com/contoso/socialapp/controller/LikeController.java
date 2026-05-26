package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts/{postId}/likes")
@RequiredArgsConstructor
@Tag(name = "Likes", description = "Like/unlike operations for posts")
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    @Operation(summary = "Like a post")
    public ResponseEntity<LikeResponse> likePost(
            @PathVariable String postId,
            @Valid @RequestBody LikeRequest request) {
        LikeResponse like = likeService.likePost(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(like);
    }

    @DeleteMapping
    @Operation(summary = "Unlike a post")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @Valid @RequestBody LikeRequest request) {
        likeService.unlikePost(postId, request);
        return ResponseEntity.noContent().build();
    }
}
