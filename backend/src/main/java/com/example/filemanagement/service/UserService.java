package com.example.filemanagement.service;

import com.example.filemanagement.dto.UserDto;
import com.example.filemanagement.entity.User;
import com.example.filemanagement.entity.UserRole;
import com.example.filemanagement.exception.ResourceNotFoundException;
import com.example.filemanagement.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = getUserById(id);
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        if (userDto.getRole() != null) {
            user.setRole(UserRole.valueOf(userDto.getRole().name()));
        }
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public UserDto convertToDto(User user) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return UserDto.builder()
                .id(String.valueOf(user.getId()))
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt().format(formatter))
                .updatedAt(user.getUpdatedAt().format(formatter))
                .avatar(user.getAvatar())
                .build();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
