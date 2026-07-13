package com.example.test.project.emaildemo;


import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) { this.mailSender = mailSender; }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        msg.setFrom("iranasinghe98@gmail.com");
        mailSender.send(msg);
    }

    public void sendEmailWithAttachment(String to, String subject, String htmlContent, String attachmentName, byte[] attachmentData) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML content
            helper.setFrom("iranasinghe98@gmail.com");
            
            org.springframework.core.io.ByteArrayResource attachmentSource = new org.springframework.core.io.ByteArrayResource(attachmentData);
            helper.addAttachment(attachmentName, attachmentSource);
            
            mailSender.send(message);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("Failed to send email with attachment: " + ex.getMessage(), ex);
        }
    }
}
