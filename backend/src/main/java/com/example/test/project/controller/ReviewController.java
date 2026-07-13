package com.example.test.project.controller;

import com.example.test.project.model.Review;
import com.example.test.project.model.Users;
import com.example.test.project.service.ReviewService;
import com.example.test.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    private Users getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userService.getUserByUsername(username);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviewsForEvent(@PathVariable int eventId) {
        return ResponseEntity.ok(reviewService.getReviewsForEvent(eventId));
    }

    @GetMapping("/event/{eventId}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable int eventId) {
        Double avg = reviewService.getAverageRating(eventId);
        Map<String, Double> response = new HashMap<>();
        response.put("averageRating", avg != null ? avg : 0.0);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        try {
            Users user = getCurrentUser();
            int eventId = (Integer) request.get("eventId");
            int rating = (Integer) request.get("rating");
            String comment = (String) request.get("comment");
            Review review = reviewService.addReview(user, eventId, rating, comment);
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
