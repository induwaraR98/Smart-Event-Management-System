package com.example.test.project.repo;

import com.example.test.project.model.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavouriteRepo extends JpaRepository<Favourite, Integer> {
    
    List<Favourite> findByUserId(int userId);
    
    boolean existsByUserIdAndEventId(int userId, int eventId);
    
    Optional<Favourite> findByUserIdAndEventId(int userId, int eventId);
}
