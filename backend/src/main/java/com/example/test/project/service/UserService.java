package com.example.test.project.service;

import com.example.test.project.model.Users;
import com.example.test.project.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public Users register(Users user) {
        if (repo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty() && repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        
        // Dynamic role assignment: if first user or contains "admin", assign ADMIN role
        if (repo.count() == 0 || user.getUsername().toLowerCase().contains("admin") || (user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN"))) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }
        return repo.save(user);
    }

    public Users getUserByUsername(String username) {
        return repo.findByUsername(username);
    }

    // Get all users
    public List<Users> getAllUsers() {
        return repo.findAll();
    }

    // Get user by ID
    public Optional<Users> getUserById(int id) {
        return repo.findById(id);
    }

    // Delete user by ID
    public boolean deleteUser(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        }
        return "fail";
    }
}
