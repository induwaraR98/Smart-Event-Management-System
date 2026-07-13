package com.example.test.project.service;

import com.example.test.project.model.Booking;
import com.example.test.project.model.Ticket;
import com.example.test.project.repo.TicketRepo;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepo ticketRepo;

    public Ticket generateTicket(Booking booking) {
        String ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Generate QR code content: Booking ID, Event ID, User ID
        String qrContent = String.format("BookingID: %d, EventID: %d, UserID: %d", 
                booking.getId(), booking.getEvent().getId(), booking.getUser().getId());
        
        String qrCodeBase64 = "";
        try {
            qrCodeBase64 = generateQRCodeBase64(qrContent, 200, 200);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Ticket ticket = new Ticket();
        ticket.setTicketNumber(ticketNumber);
        ticket.setBooking(booking);
        ticket.setQrCode(qrCodeBase64);

        return ticketRepo.save(ticket);
    }

    public String generateQRCodeBase64(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        
        return Base64.getEncoder().encodeToString(pngData);
    }

    public byte[] generateTicketPdfBytes(Ticket ticket) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);

            // Title
            Paragraph title = new Paragraph("EVENT ENTRY TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Table structure
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.5f, 1.5f});

            // Left Cell: Event Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1f, 2f});

            // Helper to add rows to info table
            addTableCell(infoTable, "Ticket Number:", labelFont, ticket.getTicketNumber(), bodyFont);
            addTableCell(infoTable, "Event Title:", labelFont, ticket.getBooking().getEvent().getTitle(), bodyFont);
            addTableCell(infoTable, "Attendee Name:", labelFont, ticket.getBooking().getUser().getUsername(), bodyFont);
            addTableCell(infoTable, "Venue:", labelFont, ticket.getBooking().getEvent().getVenue(), bodyFont);
            addTableCell(infoTable, "Address:", labelFont, ticket.getBooking().getEvent().getAddress(), bodyFont);
            addTableCell(infoTable, "Date:", labelFont, ticket.getBooking().getEvent().getDate().toString(), bodyFont);
            addTableCell(infoTable, "Time:", labelFont, ticket.getBooking().getEvent().getTime().toString(), bodyFont);
            addTableCell(infoTable, "Seats Booked:", labelFont, String.valueOf(ticket.getBooking().getSeatCount()), bodyFont);
            addTableCell(infoTable, "Total Price:", labelFont, "$" + String.format("%.2f", ticket.getBooking().getTotalPrice()), bodyFont);

            PdfPCell leftCell = new PdfPCell(infoTable);
            leftCell.setBorder(PdfPCell.NO_BORDER);
            table.addCell(leftCell);

            // Right Cell: QR Code
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(PdfPCell.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            rightCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            if (ticket.getQrCode() != null && !ticket.getQrCode().isEmpty()) {
                byte[] qrBytes = Base64.getDecoder().decode(ticket.getQrCode());
                com.lowagie.text.Image qrImage = com.lowagie.text.Image.getInstance(qrBytes);
                qrImage.scaleAbsolute(130, 130);
                qrImage.setAlignment(Element.ALIGN_CENTER);
                rightCell.addElement(qrImage);
            } else {
                rightCell.addElement(new Paragraph("No QR Code available", bodyFont));
            }
            table.addCell(rightCell);

            document.add(table);
            
            // Footer warning
            Paragraph footer = new Paragraph("\n\nPlease present this ticket at the gate for scanning and validation. Do not share this ticket.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return out.toByteArray();
    }

    private void addTableCell(PdfPTable table, String label, Font labelFont, String value, Font valFont) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBorder(PdfPCell.NO_BORDER);
        cellLabel.setPadding(6);
        table.addCell(cellLabel);

        PdfPCell cellVal = new PdfPCell(new Phrase(value != null ? value : "", valFont));
        cellVal.setBorder(PdfPCell.NO_BORDER);
        cellVal.setPadding(6);
        table.addCell(cellVal);
    }
}
