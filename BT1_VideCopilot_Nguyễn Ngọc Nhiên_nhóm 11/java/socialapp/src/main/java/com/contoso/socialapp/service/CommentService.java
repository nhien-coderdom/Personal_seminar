package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.exception.BadRequestException;
import com.contoso.socialapp.entity.Comment;
import com.contoso.socialapp.repository.CommentRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPostId(String postId) {
        // Check if post exists
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CommentResponse getCommentById(String postId, String commentId) {
        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        return mapToCommentResponse(comment);
    }

    public CommentResponse createComment(String postId, CommentCreateRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("username and content are required");
        }

        // Verify post exists
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .username(request.getUsername())
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);
        return mapToCommentResponse(comment);
    }

    public CommentResponse updateComment(String postId, String commentId, CommentUpdateRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("username and content are required");
        }

        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUsername().equals(request.getUsername())) {
            throw new BadRequestException("username mismatch");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);

        return mapToCommentResponse(comment);
    }

    public void deleteComment(String postId, String commentId) {
        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        commentRepository.delete(comment);
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .username(comment.getUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
