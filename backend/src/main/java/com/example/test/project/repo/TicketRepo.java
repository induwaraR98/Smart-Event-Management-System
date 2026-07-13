package com.example.test.project.repo;

import com.example.test.project.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Integer> {
    Optional<Ticket> findByBookingId(int bookingId);
    Optional<Ticket> findByTicketNumber(String ticketNumber);
}
