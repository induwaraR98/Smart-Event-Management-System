package com.example.test.project.repo;

import com.example.test.project.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Integer> {
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(int userId);
    
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(int userId, boolean isRead);
}
