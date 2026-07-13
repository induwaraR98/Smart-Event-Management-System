package com.example.test.project.service;

import com.example.test.project.model.Event;
import com.example.test.project.model.Favourite;
import com.example.test.project.model.Users;
import com.example.test.project.repo.EventRepo;
import com.example.test.project.repo.FavouriteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FavouriteService {

    @Autowired
    private FavouriteRepo favouriteRepo;

    @Autowired
    private EventRepo eventRepo;

    public List<Favourite> getFavouritesForUser(int userId) {
        return favouriteRepo.findByUserId(userId);
    }

    public Favourite addFavourite(Users user, int eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (favouriteRepo.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("Event is already favorited");
        }

        Favourite favourite = new Favourite();
        favourite.setUser(user);
        favourite.setEvent(event);
        return favouriteRepo.save(favourite);
    }

    public boolean removeFavourite(Users user, int eventId) {
        Optional<Favourite> favourite = favouriteRepo.findByUserIdAndEventId(user.getId(), eventId);
        if (favourite.isPresent()) {
            favouriteRepo.delete(favourite.get());
            return true;
        }
        return false;
    }

    public boolean isFavorited(int userId, int eventId) {
        return favouriteRepo.existsByUserIdAndEventId(userId, eventId);
    }
}
