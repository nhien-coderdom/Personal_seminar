package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.exception.ResourceNotFoundException;
import com.contoso.socialapp.exception.BadRequestException;
import com.contoso.socialapp.entity.Post;
import com.contoso.socialapp.repository.PostRepository;
import com.contoso.socialapp.repository.CommentRepository;
import com.contoso.socialapp.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return mapToPostResponse(post);
    }

    public PostResponse createPost(PostCreateRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("username and content are required");
        }

        Post post = Post.builder()
                .username(request.getUsername())
                .content(request.getContent())
                .build();

        post = postRepository.save(post);
        return mapToPostResponse(post);
    }

    public PostResponse updatePost(String postId, PostUpdateRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("username and content are required");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUsername().equals(request.getUsername())) {
            throw new BadRequestException("username mismatch");
        }

        post.setContent(request.getContent());
        post = postRepository.save(post);

        return mapToPostResponse(post);
    }

    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // Delete associated comments and likes (cascade should handle this)
        commentRepository.deleteByPostId(postId);
        likeRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    private PostResponse mapToPostResponse(Post post) {
        int likesCount = likeRepository.countByPostId(post.getId());
        int commentsCount = commentRepository.countByPostId(post.getId());

        return PostResponse.builder()
                .id(post.getId())
                .username(post.getUsername())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .build();
    }
}
