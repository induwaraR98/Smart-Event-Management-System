package com.example.test.project.controller;

import com.example.test.project.model.Favourite;
import com.example.test.project.model.Users;
import com.example.test.project.service.FavouriteService;
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
@RequestMapping("/api/favourites")
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;

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

    @GetMapping
    public ResponseEntity<List<Favourite>> getFavourites() {
        Users user = getCurrentUser();
        return ResponseEntity.ok(favouriteService.getFavouritesForUser(user.getId()));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<?> addFavourite(@PathVariable int eventId) {
        try {
            Users user = getCurrentUser();
            Favourite fav = favouriteService.addFavourite(user, eventId);
            return new ResponseEntity<>(fav, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> removeFavourite(@PathVariable int eventId) {
        Users user = getCurrentUser();
        boolean removed = favouriteService.removeFavourite(user, eventId);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{eventId}/check")
    public ResponseEntity<Map<String, Boolean>> checkFavourite(@PathVariable int eventId) {
        Users user = getCurrentUser();
        boolean isFav = favouriteService.isFavorited(user.getId(), eventId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("favorited", isFav);
        return ResponseEntity.ok(response);
    }
}
