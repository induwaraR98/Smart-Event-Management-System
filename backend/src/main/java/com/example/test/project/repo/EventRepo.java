package com.example.test.project.repo;

import com.example.test.project.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Integer> {

    @Query("SELECT e FROM Event e WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.organizer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.category.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:startDate IS NULL OR e.date >= :startDate) AND " +
           "(:endDate IS NULL OR e.date <= :endDate) AND " +
           "(:maxPrice IS NULL OR e.ticketPrice <= :maxPrice) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(e.address) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Event> searchAndFilterEvents(
            @Param("query") String query,
            @Param("categoryId") Integer categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("maxPrice") Double maxPrice,
            @Param("location") String location,
            Pageable pageable
    );

    List<Event> findTop5ByOrderByDateAsc();

    @Query("SELECT e FROM Event e ORDER BY (e.totalSeats - e.availableSeats) DESC")
    List<Event> findPopularEvents(Pageable pageable);
}
