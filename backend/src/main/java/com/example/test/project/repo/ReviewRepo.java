package com.example.test.project.repo;

import com.example.test.project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Integer> {
    
    List<Review> findByEventIdOrderByCreatedAtDesc(int eventId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.event.id = :eventId")
    Double getAverageRatingForEvent(int eventId);

    boolean existsByUserIdAndEventId(int userId, int eventId);
}
