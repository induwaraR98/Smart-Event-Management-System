package com.example.test.project.emaildemo;



import com.example.test.project.emaildemo.EmailRequest;
import com.example.test.project.emaildemo.EmailService;

import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/email")
public class EmailWebController {

    private final EmailService emailService;
    public EmailWebController(EmailService emailService) { this.emailService = emailService; }

    @GetMapping
    public String showForm(Model model) {
        if (!model.containsAttribute("emailRequest")) {
            model.addAttribute("emailRequest", new EmailRequest());
        }
        return "email-form";
    }

    @PostMapping("/send")
    public String send(
            @Valid @ModelAttribute("emailRequest") EmailRequest emailRequest,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes,
            Model model) {
        if (bindingResult.hasErrors()) {
            // show validation errors on the same page
            return "email-form";
        }
        try {
            emailService.sendSimpleEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
            redirectAttributes.addFlashAttribute("success", "Email sent to " + emailRequest.getTo());
            return "redirect:/email"; // redirect to avoid form resubmission
        } catch (Exception ex) {
            model.addAttribute("error", "Failed to send email: " + ex.getMessage());
            return "email-form";
        }
    }



}

