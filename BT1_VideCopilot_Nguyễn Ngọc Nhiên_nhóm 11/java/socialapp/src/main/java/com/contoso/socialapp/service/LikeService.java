package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.exception.BadRequestException;
import com.contoso.socialapp.entity.Like;
import com.contoso.socialapp.entity.Post;
import com.contoso.socialapp.repository.LikeRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public LikeResponse likePost(String postId, LikeRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BadRequestException("username is required");
        }

        // Verify post exists
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        // Check if already liked
        if (likeRepository.existsByPostIdAndUsername(postId, request.getUsername())) {
            // Return existing like representation as per FastAPI behavior
            return LikeResponse.builder()
                    .postId(postId)
                    .username(request.getUsername())
                    .createdAt(Instant.now().toString())
                    .build();
        }

        Like like = Like.builder()
                .postId(postId)
                .username(request.getUsername())
                .build();

        try {
            like = likeRepository.save(like);
            return LikeResponse.builder()
                    .postId(postId)
                    .username(request.getUsername())
                    .createdAt(like.getCreatedAt())
                    .build();
        } catch (DataIntegrityViolationException e) {
            // Handle race condition - already liked
            return LikeResponse.builder()
                    .postId(postId)
                    .username(request.getUsername())
                    .createdAt(Instant.now().toString())
                    .build();
        }
    }

    public void unlikePost(String postId, LikeRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        // Delete like if exists (FastAPI doesn't check if like exists before deleting)
        likeRepository.deleteByPostIdAndUsername(postId, request.getUsername());
    }
}
