package com.example.staymate.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.payment.PaymentIdResponseDTO;
import com.example.staymate.dto.payment.PaymentRequestDTO;
import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.service.BookingService;
import com.example.staymate.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    @Operation(summary = "Create and process a new payment", description = "Create a new payment entry and process it in one API call.")
    @PostMapping
    public ResponseEntity<CustomResponse<String>> createAndProcessPayment(
            @Parameter(description = "The payment details for creating a new payment") @RequestBody PaymentRequestDTO paymentRequestDTO,
            @Parameter(description = "The payment method to process the payment") @RequestParam PaymentMethod paymentMethod) {
        try {

            Long bookingId = paymentRequestDTO.getBookingId();
            Double paymentAmount = paymentRequestDTO.getAmount();

            // Retrieve the booking details
            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new CustomResponse<>("Booking not found.", null));
            }

            // Calculate total paid amount
            Double totalPaid = paymentService.getTotalPaidAmount(bookingId);
            Double remainingAmount = booking.getTotalAmount() - totalPaid;

            if (paymentAmount > remainingAmount) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new CustomResponse<>(
                                "Payment exceeds remaining balance. Remaining amount: " + remainingAmount, null));
            }

            // 1. Create the payment entry in the database (initially in PENDING state)
            Payment newPayment = paymentService.createPayment(bookingId, paymentMethod,
                    paymentAmount);

            // 2. Process the payment (update status based on payment method)
            paymentService.processPayment(newPayment.getId(), paymentMethod);

            // 3. Return a successful response with the processed payment status
            Payment processedPayment = paymentService.getPaymentById(newPayment.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Payment created and processed successfully. Current status: "
                            + processedPayment.getStatus(), null));
        } catch (Exception e) {
            // Return an error response if something goes wrong
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Error creating and processing payment: " + e.getMessage(), null));
        }
    }

    @Operation(summary = "Get payment by ID", description = "Retrieve a specific payment by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<PaymentIdResponseDTO>> getPaymentById(
            @Parameter(description = "ID of the payment to retrieve") @PathVariable Long id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            PaymentIdResponseDTO paymentIdResponseDTO = new PaymentIdResponseDTO(payment);
            return ResponseEntity.ok(new CustomResponse<>("Payment retrieved successfully", paymentIdResponseDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Payment not found", null));
        }
    }

    @Operation(summary = "Get payments by booking ID", description = "Retrieve all payments associated with a specific booking ID.")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByBookingId(
            @Parameter(description = "ID of the booking to retrieve payments for") @PathVariable Long bookingId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);

            // Convert the list of Payment entities to PaymentIdResponseDTO objects
            List<PaymentIdResponseDTO> paymentIdResponseDTOs = payments.stream()
                    .map(PaymentIdResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", paymentIdResponseDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Payments not found", null));
        }
    }

    @Operation(summary = "Get payments by user ID", description = "Retrieve all payments associated with a specific user ID.")
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByUserId(
            @Parameter(description = "ID of the user to retrieve payments for") @PathVariable Long userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);

            // Convert the list of Payment entities to PaymentIdResponseDTO objects
            List<PaymentIdResponseDTO> paymentIdResponseDTOs = payments.stream()
                    .map(PaymentIdResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", paymentIdResponseDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Payments not found", null));
        }
    }

}
