package com.contoso.socialapp.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CommentResponse {
    private String id;
    private String postId;
    private String username;
    private String content;
    private String createdAt;
    private String updatedAt;
}
