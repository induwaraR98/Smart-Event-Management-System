package com.example.test.project.controller;

import com.example.test.project.model.Booking;
import com.example.test.project.model.Users;
import com.example.test.project.service.BookingService;
import com.example.test.project.service.ReportService;
import com.example.test.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

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

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        return ResponseEntity.ok(reportService.getAdminDashboardStats());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard() {
        Users user = getCurrentUser();
        return ResponseEntity.ok(reportService.getUserDashboardStats(user));
    }

    @GetMapping("/admin/reports/bookings/pdf")
    public ResponseEntity<byte[]> downloadBookingReportPdf() {
        List<Booking> bookings = bookingService.getAllBookings();
        byte[] pdfBytes = reportService.generateBookingReportPdf(bookings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Bookings-Report.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/admin/reports/bookings/excel")
    public ResponseEntity<byte[]> downloadBookingReportExcel() {
        List<Booking> bookings = bookingService.getAllBookings();
        byte[] excelBytes = reportService.generateBookingReportExcel(bookings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "Bookings-Report.xlsx");

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }
}
