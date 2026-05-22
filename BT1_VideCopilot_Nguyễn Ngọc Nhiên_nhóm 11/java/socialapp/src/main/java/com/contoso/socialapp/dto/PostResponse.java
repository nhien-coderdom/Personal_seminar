package com.contoso.socialapp.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class PostResponse {
    private String id;
    private String username;
    private String content;
    private String createdAt;
    private String updatedAt;
    private int likesCount;
    private int commentsCount;
}
