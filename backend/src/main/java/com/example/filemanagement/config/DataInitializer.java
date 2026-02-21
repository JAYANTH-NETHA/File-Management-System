package com.example.filemanagement.config;

import com.example.filemanagement.entity.User;
import com.example.filemanagement.entity.UserRole;
import com.example.filemanagement.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@filecrm.com")) {
            User adminUser = User.builder()
                    .email("admin@filecrm.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Sarah")
                    .lastName("Chen")
                    .role(UserRole.ADMIN)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(adminUser);
            log.info("Admin user created: admin@filecrm.com");
        }

        // Create default customer user if it doesn't exist
        if (!userRepository.existsByEmail("john@example.com")) {
            User customerUser = User.builder()
                    .email("john@example.com")
                    .password(passwordEncoder.encode("customer123"))
                    .firstName("John")
                    .lastName("Rivera")
                    .role(UserRole.CUSTOMER)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(customerUser);
            log.info("Customer user created: john@example.com");
        }
    }
}
