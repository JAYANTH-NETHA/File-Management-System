package com.example.filemanagement.service;

import com.example.filemanagement.dto.FileDto;
import com.example.filemanagement.entity.FileEntity;
import com.example.filemanagement.entity.User;
import com.example.filemanagement.exception.ResourceNotFoundException;
import com.example.filemanagement.exception.UnauthorizedAccessException;
import com.example.filemanagement.repository.FileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ActivityService activityService;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public FileDto uploadFile(MultipartFile file, User user) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            FileEntity fileEntity = FileEntity.builder()
                    .name(file.getOriginalFilename())
                    .type(file.getContentType())
                    .size(file.getSize())
                    .filePath(filePath.toString())
                    .user(user)
                    .build();

            FileEntity savedFile = fileRepository.save(fileEntity);
            
            // Log activity
            activityService.logActivity(user, "file_upload", 
                    "Uploaded " + file.getOriginalFilename());
            
            log.info("File uploaded successfully: {} by user: {}", fileName, user.getEmail());
            return convertToDto(savedFile);
        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage());
            throw new IOException("Failed to upload file", e);
        }
    }

    public List<FileDto> getFilesByUser(Long userId) {
        User user = userService.getUserById(userId);
        return fileRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FileDto> getAllFiles() {
        return fileRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public FileDto getFile(Long fileId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));
        return convertToDto(file);
    }

public void deleteFile(Long fileId, User user) {
    FileEntity file = fileRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));

    // 1. IMPROVED PERMISSION CHECK
    boolean isOwner = file.getUser().getId().equals(user.getId());
    
    // Check if the role is ADMIN (adjust "ADMIN" to match your database exactly)
    boolean isAdmin = user.getRole().name().equals("ADMIN") || user.getRole().name().equals("ROLE_ADMIN");

    if (!isOwner && !isAdmin) {
        throw new UnauthorizedAccessException("You don't have permission to delete this file");
    }

    try {
        // 2. Delete physical file from the "uploads" folder
        if (file.getFilePath() != null) {
            Files.deleteIfExists(Paths.get(file.getFilePath()));
        }
        
        // 3. Delete from Database
        fileRepository.delete(file);
        
        // 4. Log the activity
        activityService.logActivity(user, "file_delete", "Deleted " + file.getName());
        
        log.info("File {} deleted successfully by {}", fileId, user.getEmail());
    } catch (IOException e) {
        log.error("Failed to delete physical file: {}", e.getMessage());
        throw new RuntimeException("Failed to delete file", e);
    }
}

    public byte[] downloadFile(Long fileId) throws IOException {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        
        return Files.readAllBytes(Paths.get(file.getFilePath()));
    }

    public FileDto convertToDto(FileEntity file) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return FileDto.builder()
                .id(String.valueOf(file.getId()))
                .name(file.getName())
                .type(file.getType())
                .size(file.getSize())
                .uploadedAt(file.getUploadedAt().format(formatter))
                .userId(String.valueOf(file.getUser().getId()))
                .userName(file.getUser().getFirstName() + " " + file.getUser().getLastName())
                .url(file.getFileUrl())
                .build();
    }
}
