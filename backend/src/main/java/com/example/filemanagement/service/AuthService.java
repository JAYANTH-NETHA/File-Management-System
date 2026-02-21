package com.example.filemanagement.service;

import com.example.filemanagement.dto.LoginRequest;
import com.example.filemanagement.dto.RegisterRequest;
import com.example.filemanagement.dto.UserDto;
import com.example.filemanagement.entity.User;
import com.example.filemanagement.entity.UserRole;
import com.example.filemanagement.exception.EmailAlreadyExistsException;
import com.example.filemanagement.exception.ResourceNotFoundException;
import com.example.filemanagement.repository.UserRepository;
import com.example.filemanagement.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    public String login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return jwtUtil.generateToken(user, user.getRole().name());
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(UserRole.CUSTOMER)
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", request.getEmail());
    }

    public UserDto getUserProfile(String email) {
        User user = userService.getUserByEmail(email);
        return userService.convertToDto(user);
    }
}
