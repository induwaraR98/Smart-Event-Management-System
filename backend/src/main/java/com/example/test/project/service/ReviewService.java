package com.example.test.project.service;

import com.example.test.project.model.Event;
import com.example.test.project.model.Review;
import com.example.test.project.model.Users;
import com.example.test.project.repo.BookingRepo;
import com.example.test.project.repo.EventRepo;
import com.example.test.project.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private EventRepo eventRepo;

    public List<Review> getReviewsForEvent(int eventId) {
        return reviewRepo.findByEventIdOrderByCreatedAtDesc(eventId);
    }

    public Review addReview(Users user, int eventId, int rating, String comment) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot review an event that hasn't happened yet");
        }

        boolean attended = bookingRepo.existsByUserIdAndEventIdAndStatus(user.getId(), eventId, "BOOKED");
        if (!attended) {
            throw new RuntimeException("Only attendees can review this event");
        }

        if (reviewRepo.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("You have already reviewed this event");
        }

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepo.save(review);
    }

    public Double getAverageRating(int eventId) {
        return reviewRepo.getAverageRatingForEvent(eventId);
    }
}
