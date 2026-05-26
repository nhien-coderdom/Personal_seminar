package com.contoso.socialapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.Instant;

@Entity
@Table(name = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(LikeId.class)
public class Like {
    @Id
    @Column(name = "post_id", nullable = false)
    private String postId;

    @Id
    @Column(nullable = false)
    private String username;

    @Column(name = "created_at", nullable = false, updatable = false)
    private String createdAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now().toString();
    }
}
