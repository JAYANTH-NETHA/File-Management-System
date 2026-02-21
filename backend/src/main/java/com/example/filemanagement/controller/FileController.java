package com.example.filemanagement.controller;

import com.example.filemanagement.dto.FileDto;
import com.example.filemanagement.entity.User;
import com.example.filemanagement.service.FileService;
import com.example.filemanagement.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            FileDto uploadedFile = fileService.uploadFile(file, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedFile);
        } catch (IOException e) {
            log.error("File upload failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to upload file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserFiles(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            List<FileDto> files = fileService.getFilesByUser(user.getId());
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            log.error("Failed to fetch user files: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch files");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<?> getFile(@PathVariable Long fileId) {
        try {
            FileDto file = fileService.getFile(fileId);
            return ResponseEntity.ok(file);
        } catch (Exception e) {
            log.error("Failed to fetch file: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "File not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId, Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            fileService.deleteFile(fileId, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete file: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {
        try {
            FileDto file = fileService.getFile(fileId);
            byte[] fileData = fileService.downloadFile(fileId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(fileData.length)
                    .body(fileData);
        } catch (IOException e) {
            log.error("Failed to download file: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to download file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
