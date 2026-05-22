package com.contoso.socialapp.exception;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private int code;
    private String message;

    // Constructor for convenience with HTTP status
    public ErrorResponse(String message) {
        this.code = 500;
        this.message = message;
    }
}
