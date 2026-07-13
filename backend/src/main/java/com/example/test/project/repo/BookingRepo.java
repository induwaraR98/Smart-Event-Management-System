package com.example.test.project.repo;

import com.example.test.project.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Integer> {
    
    List<Booking> findByUserIdOrderByBookingDateDesc(int userId);
    
    List<Booking> findByEventId(int eventId);
    
    List<Booking> findTop5ByOrderByBookingDateDesc();
    
    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'BOOKED'")
    Double calculateTotalRevenue();

    boolean existsByUserIdAndEventIdAndStatus(int userId, int eventId, String status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'BOOKED'")
    long countActiveBookings();
}
