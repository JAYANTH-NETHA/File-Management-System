package com.example.filemanagement.dto;

import com.example.filemanagement.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String createdAt;
    private String updatedAt;
    private String avatar;
}
