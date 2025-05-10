package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Notification;
import com.eduvibe.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification saveNotification(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(new Date());
        }
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByOwnerUsername(String ownerUsername) {
        return notificationRepository.findByOwnerUsername(ownerUsername);
    }

    public void markAsRead(String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    public void markAllAsRead(String ownerUsername) {
        List<Notification> notifications = notificationRepository.findByOwnerUsername(ownerUsername);
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        }
    }

    // New method to delete a notification by ID
    public void deleteById(String id) {
        notificationRepository.deleteById(id);
    }
}