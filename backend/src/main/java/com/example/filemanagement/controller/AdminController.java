package com.example.filemanagement.controller;

import com.example.filemanagement.dto.ActivityDto;
import com.example.filemanagement.dto.FileDto;
import com.example.filemanagement.dto.UserDto;
import com.example.filemanagement.service.ActivityService;
import com.example.filemanagement.service.FileService;
import com.example.filemanagement.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserDto> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to fetch users: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch users");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        try {
            UserDto updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Failed to update user: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete user: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete user");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/files")
    public ResponseEntity<?> getAllFiles() {
        try {
            List<FileDto> files = fileService.getAllFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            log.error("Failed to fetch files: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch files");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            List<UserDto> allUsers = userService.getAllUsers();
            List<FileDto> allFiles = fileService.getAllFiles();
            List<ActivityDto> recentActivities = activityService.getRecentActivities(10);
            
            long totalCustomers = allUsers.stream()
                    .filter(u -> u.getRole().name().equals("CUSTOMER"))
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", allUsers.size());
            stats.put("totalFiles", allFiles.size());
            stats.put("totalCustomers", totalCustomers);
            stats.put("recentActivity", recentActivities);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to fetch dashboard stats: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch statistics");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
