package com.example.test.project.service;

import com.example.test.project.emaildemo.EmailService;
import com.example.test.project.model.Booking;
import com.example.test.project.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    // Run every day at 9:00 AM (local time check)
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendEventReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Booking> bookings = bookingRepo.findAll();

        for (Booking booking : bookings) {
            if ("BOOKED".equalsIgnoreCase(booking.getStatus()) && tomorrow.equals(booking.getEvent().getDate())) {
                sendReminderEmail(booking);
            }
        }
    }

    private void sendReminderEmail(Booking booking) {
        String to = booking.getUser().getEmail();
        if (to == null || to.isEmpty()) return;

        String subject = "Reminder: Event Tomorrow - " + booking.getEvent().getTitle();
        String body = String.format(
            "<h3>Dear %s,</h3>" +
            "<p>This is a friendly reminder that the event <b>%s</b> is happening tomorrow!</p>" +
            "<ul>" +
            "  <li><b>Venue:</b> %s</li>" +
            "  <li><b>Date:</b> %s</li>" +
            "  <li><b>Time:</b> %s</li>" +
            "  <li><b>Your Tickets:</b> %d</li>" +
            "</ul>" +
            "<p>Please have your ticket ready with you. We look forward to seeing you there!</p>" +
            "<p>Best regards,<br/>Smart Event Management System Team</p>",
            booking.getUser().getUsername(), booking.getEvent().getTitle(),
            booking.getEvent().getVenue(), booking.getEvent().getDate().toString(),
            booking.getEvent().getTime().toString(), booking.getSeatCount()
        );

        try {
            emailService.sendSimpleEmail(to, subject, body);
            notificationService.createNotification(booking.getUser(), "Reminder: Event '" + booking.getEvent().getTitle() + "' is tomorrow!");
        } catch (Exception e) {
            System.err.println("Failed to send event reminder email: " + e.getMessage());
        }
    }
}
