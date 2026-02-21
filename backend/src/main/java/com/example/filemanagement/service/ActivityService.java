package com.example.filemanagement.service;

import com.example.filemanagement.dto.ActivityDto;
import com.example.filemanagement.entity.Activity;
import com.example.filemanagement.entity.User;
import com.example.filemanagement.repository.ActivityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public void logActivity(User user, String action, String description) {
        Activity activity = Activity.builder()
                .user(user)
                .action(action)
                .description(description)
                .build();
        activityRepository.save(activity);
        log.info("Activity logged: {} - {} by {}", action, description, user.getEmail());
    }

    public List<ActivityDto> getRecentActivities(int limit) {
        return activityRepository.findRecentActivities(limit).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ActivityDto> getUserActivities(Long userId) {
        return activityRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ActivityDto convertToDto(Activity activity) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return ActivityDto.builder()
                .id(String.valueOf(activity.getId()))
                .action(activity.getAction())
                .description(activity.getDescription())
                .timestamp(activity.getCreatedAt().format(formatter))
                .userId(String.valueOf(activity.getUser().getId()))
                .userName(activity.getUser().getFirstName() + " " + activity.getUser().getLastName())
                .build();
    }
}
