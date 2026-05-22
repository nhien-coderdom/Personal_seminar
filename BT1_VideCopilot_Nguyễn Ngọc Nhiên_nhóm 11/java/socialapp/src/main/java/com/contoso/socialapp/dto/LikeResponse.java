package com.contoso.socialapp.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LikeResponse {
    private String postId;
    private String username;
    private String createdAt;
}
