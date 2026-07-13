package com.example.test.project.service;

import com.example.test.project.model.Notification;
import com.example.test.project.model.Users;
import com.example.test.project.repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    public void createNotification(Users user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepo.save(notification);
    }

    public List<Notification> getNotificationsForUser(int userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotificationsForUser(int userId) {
        return notificationRepo.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    public boolean markAsRead(int notificationId) {
        return notificationRepo.findById(notificationId).map(notification -> {
            notification.setRead(true);
            notificationRepo.save(notification);
            return true;
        }).orElse(false);
    }

    public void markAllAsRead(int userId) {
        List<Notification> unread = notificationRepo.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        notificationRepo.saveAll(unread);
    }
}
