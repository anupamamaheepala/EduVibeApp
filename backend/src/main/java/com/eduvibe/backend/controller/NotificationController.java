package com.eduvibe.backend.controller;

import com.eduvibe.backend.model.Notification;
import com.eduvibe.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{ownerUsername}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String ownerUsername) {
        List<Notification> notifications = notificationService.getNotificationsByOwnerUsername(ownerUsername);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/mark-read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-all-read/{ownerUsername}")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String ownerUsername) {
        notificationService.markAllAsRead(ownerUsername);
        return ResponseEntity.ok().build();
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        notificationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}