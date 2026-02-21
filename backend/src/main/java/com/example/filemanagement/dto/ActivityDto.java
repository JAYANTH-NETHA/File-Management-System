package com.example.filemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDto {
    private String id;
    private String action;
    private String description;
    private String timestamp;
    private String userId;
    private String userName;
}
