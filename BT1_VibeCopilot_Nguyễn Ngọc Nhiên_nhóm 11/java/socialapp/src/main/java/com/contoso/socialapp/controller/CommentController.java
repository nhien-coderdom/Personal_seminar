package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Operations related to comments on posts")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    @Operation(summary = "List comments for a post")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable String postId) {
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    @Operation(summary = "Create a new comment on a post")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable String postId,
            @Valid @RequestBody CommentCreateRequest request) {
        CommentResponse comment = commentService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/{commentId}")
    @Operation(summary = "Get a comment by ID")
    public ResponseEntity<CommentResponse> getCommentById(
            @PathVariable String postId,
            @PathVariable String commentId) {
        CommentResponse comment = commentService.getCommentById(postId, commentId);
        return ResponseEntity.ok(comment);
    }

    @PatchMapping("/{commentId}")
    @Operation(summary = "Update a comment")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateRequest request) {
        CommentResponse comment = commentService.updateComment(postId, commentId, request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        commentService.deleteComment(postId, commentId);
        return ResponseEntity.noContent().build();
    }
}
