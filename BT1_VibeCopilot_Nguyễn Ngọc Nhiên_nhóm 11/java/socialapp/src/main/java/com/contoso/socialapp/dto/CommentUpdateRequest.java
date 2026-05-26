package com.contoso.socialapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentUpdateRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Content is required")
    private String content;
}
