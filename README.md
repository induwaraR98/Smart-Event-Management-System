# Smart Event Management System

A production-ready, feature-rich **Smart Event Management System** featuring a robust Spring Boot backend API and a modern, responsive React frontend.

## 📂 Project Structure

- **`/backend`**: The Spring Boot backend codebase. Mapped with JWT security, PostgreSQL database, QR code generation, and automated PDF ticket printing.
- **`/frontend`**: The React client SPA scaffolded with Vite, TypeScript, and Tailwind CSS v4.

---

## 🚀 Getting Started

### 1. Prerequisite: PostgreSQL Setup
Create a PostgreSQL database named `testuser` (or specify an existing database in `backend/src/main/resources/application.properties`):

```sql
CREATE DATABASE testuser;
```

---

### 2. Running the Backend API
Navigate to the `backend/` folder and boot the Spring Boot server using the Maven wrapper:

```bash
cd backend
./mvnw.cmd spring-boot:run
```
- **API URL**: `http://localhost:8080`
- **SMTP configuration**: Outbox email notifications are active using default SMTP app credentials.

---

### 3. Running the React Client
Navigate to the `frontend/` folder, install required packages, and run the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
- **Frontend URL**: `http://localhost:5173`

---

## ⚡ Role-Based Authorization Guidelines

The application supports two user roles: `ADMIN` and `USER`.

- **First Registration / "admin" override**: To make it easy to start, **the very first user** registered in the database automatically receives the `ADMIN` role. Additionally, any registered user containing the word **`admin`** in their username (e.g. `admin_user`) is allocated `ADMIN` permissions.
- **Admin Capabilities**: Add/Edit/Delete events, manage event categories, view all global bookings, and export PDF/Excel administrative reports.
- **User Capabilities**: Search/filter events, book seats, cancel bookings, view booking logs, download ticket PDFs, save favorite events, and leave verified ratings/reviews.

---

## 🧪 Testing Key Scenarios

1. **User Sign Up**: Create an account on the client register page (`/register`).
2. **Category Creation**: Log in as `ADMIN` and navigate to **Categories** to add event categories (e.g., Technology, Business).
3. **Publish Events**: Create an event as `ADMIN` with title, date, pricing, venue, and seats.
4. **Booking Seat Deductions**: Log in as `USER` (`/login`), locate the published event, and select 2 tickets. Once confirmed, available seats automatically decrease.
5. **PDF & Email Ticket Printing**: Check your email box! You will receive an automated HTML confirmation with a PDF attachment containing booking details and a ZXing QR Code. Download the PDF from the user dashboard to review layout.
6. **Cancellation & Seat Restoration**: Click **Cancel** on your bookings list to restore event seats and receive a cancellation confirmation email.
7. **Verified Rating Reviews**: After an event's date has passed, users who booked tickets can submit 1-5 star ratings and reviews. Non-attendees are restricted.
8. **Admin Logs Export**: Log in as `ADMIN` and download Excel/PDF booking ledgers from the reports dashboard.
