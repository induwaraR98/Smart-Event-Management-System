package com.example.test.project.service;

import com.example.test.project.model.Event;
import com.example.test.project.repo.EventRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepo eventRepo;

    public Page<Event> getEvents(String query, Integer categoryId, LocalDate startDate, LocalDate endDate,
                                 Double maxPrice, String location, String sortBy, String sortDir, int page, int size) {
        Sort.Direction direction = Sort.Direction.ASC;
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }
        
        String sortProperty = "date";
        if (sortBy != null) {
            if (sortBy.equalsIgnoreCase("price")) {
                sortProperty = "ticketPrice";
            } else if (sortBy.equalsIgnoreCase("title")) {
                sortProperty = "title";
            } else if (sortBy.equalsIgnoreCase("popularity")) {
                // JPA custom sort or fallback
                sortProperty = "availableSeats"; // Sort by seats remaining or similar
                direction = Sort.Direction.ASC; // fewer available seats = more popular
            }
        }
        
        Sort sort = Sort.by(direction, sortProperty);
        Pageable pageable = PageRequest.of(page, size, sort);
        return eventRepo.searchAndFilterEvents(query, categoryId, startDate, endDate, maxPrice, location, pageable);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepo.findTop5ByOrderByDateAsc();
    }

    public List<Event> getPopularEvents(int limit) {
        return eventRepo.findPopularEvents(PageRequest.of(0, limit));
    }

    public Optional<Event> getEventById(int id) {
        return eventRepo.findById(id);
    }

    public Event createEvent(Event event) {
        event.setAvailableSeats(event.getTotalSeats());
        return eventRepo.save(event);
    }

    public Optional<Event> updateEvent(int id, Event updatedEvent) {
        return eventRepo.findById(id).map(existing -> {
            int bookedSeats = existing.getTotalSeats() - existing.getAvailableSeats();
            
            existing.setTitle(updatedEvent.getTitle());
            existing.setDescription(updatedEvent.getDescription());
            existing.setCategory(updatedEvent.getCategory());
            existing.setVenue(updatedEvent.getVenue());
            existing.setAddress(updatedEvent.getAddress());
            existing.setDate(updatedEvent.getDate());
            existing.setTime(updatedEvent.getTime());
            existing.setOrganizer(updatedEvent.getOrganizer());
            existing.setTicketPrice(updatedEvent.getTicketPrice());
            existing.setEventImage(updatedEvent.getEventImage());
            
            if (updatedEvent.getStatus() != null) {
                existing.setStatus(updatedEvent.getStatus());
            }
            
            existing.setTotalSeats(updatedEvent.getTotalSeats());
            existing.setAvailableSeats(updatedEvent.getTotalSeats() - bookedSeats);
            
            return eventRepo.save(existing);
        });
    }

    public boolean deleteEvent(int id) {
        if (eventRepo.existsById(id)) {
            eventRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
