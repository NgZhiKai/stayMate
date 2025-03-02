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
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create and process a new payment in one call
    @PostMapping
    public ResponseEntity<CustomResponse<String>> createAndProcessPayment(@RequestBody PaymentRequestDTO paymentRequestDTO, @RequestParam PaymentMethod paymentMethod) {
        try {
            // 1. Create the payment entry in the database (initially in PENDING state)
            Payment newPayment = paymentService.createPayment(paymentRequestDTO.getBookingId(), paymentMethod, paymentRequestDTO.getAmount());

            // 2. Process the payment (update status based on payment method)
            paymentService.processPayment(newPayment.getId(), paymentMethod);

            // 3. Return a successful response with the processed payment status
            Payment processedPayment = paymentService.getPaymentById(newPayment.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Payment created and processed successfully. Current status: " + processedPayment.getStatus(), null));
        } catch (Exception e) {
            // Return an error response if something goes wrong
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Error creating and processing payment: " + e.getMessage(), null));
        }
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<PaymentIdResponseDTO>> getPaymentById(@PathVariable Long id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            PaymentIdResponseDTO paymentIdResponseDTO = new PaymentIdResponseDTO(payment);
            return ResponseEntity.ok(new CustomResponse<>("Payment retrieved successfully", paymentIdResponseDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Payment not found", null));
        }
    }

    // Get payments for a specific booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByBookingId(@PathVariable Long bookingId) {
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

    // Get payments for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByUserId(@PathVariable Long userId) {
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
