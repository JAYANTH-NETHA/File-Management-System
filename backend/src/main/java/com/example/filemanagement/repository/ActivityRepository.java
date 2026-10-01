package com.example.filemanagement.repository;

import com.example.filemanagement.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

import java.util.List;

// @Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByUserIdOrderByCreatedAtDesc(Long userId);

    // FIX: Re-added ":limit" to the native query
    @Query(value = "SELECT * FROM activities ORDER BY created_at DESC LIMIT : limit : nativeQuery = true)
    List<Activity> findRecentActivities(@Param("limit") int limit);
}