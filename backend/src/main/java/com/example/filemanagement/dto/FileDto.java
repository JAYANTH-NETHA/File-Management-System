package com.example.filemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileDto {
    private String id;
    private String name;
    private String type;
    private Long size;
    private String uploadedAt;
    private String userId;
    private String userName;
    private String url;
}
