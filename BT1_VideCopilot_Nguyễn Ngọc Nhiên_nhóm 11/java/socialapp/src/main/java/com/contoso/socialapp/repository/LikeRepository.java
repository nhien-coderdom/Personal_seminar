package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Like;
import com.contoso.socialapp.entity.LikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, LikeId> {

    boolean existsByPostIdAndUsername(String postId, String username);

    int countByPostId(String postId);

    void deleteByPostIdAndUsername(String postId, String username);

    void deleteByPostId(String postId);
}
