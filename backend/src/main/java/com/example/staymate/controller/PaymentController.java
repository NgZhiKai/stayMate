package com.example.staymate.controller;

import com.example.staymate.dto.payment.PaymentIdResponseDTO;
import com.example.staymate.dto.payment.PaymentRequestDTO;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create and process a new payment in one call
    @PostMapping
    public ResponseEntity<String> createAndProcessPayment(@RequestBody PaymentRequestDTO paymentRequestDTO, @RequestParam PaymentMethod paymentMethod) {
        try {
            // 1. Create the payment entry in the database (initially in PENDING state)
            Payment newPayment = paymentService.createPayment(paymentRequestDTO.getBookingId(), paymentMethod, paymentRequestDTO.getAmount());

            // 2. Process the payment (update status based on payment method)
            paymentService.processPayment(newPayment.getId(), paymentMethod);

            // 3. Return a successful response with the processed payment status
            Payment processedPayment = paymentService.getPaymentById(newPayment.getId());
            return new ResponseEntity<>("Payment created and processed successfully. Current status: " + processedPayment.getStatus(), HttpStatus.CREATED);
        } catch (Exception e) {
            // Return an error response if something goes wrong
            return new ResponseEntity<>("Error creating and processing payment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentIdResponseDTO> getPaymentById(@PathVariable Long id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            PaymentIdResponseDTO paymentIdResponseDTO = new PaymentIdResponseDTO(payment);
            return new ResponseEntity<>(paymentIdResponseDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }    

    // Get payments for a specific booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentIdResponseDTO>> getPaymentsByBookingId(@PathVariable Long bookingId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);
            
            // Convert the list of Payment entities to PaymentIdResponseDTO objects
            List<PaymentIdResponseDTO> paymentIdResponseDTOs = payments.stream()
                .map(PaymentIdResponseDTO::new)
                .collect(Collectors.toList());
            
            return new ResponseEntity<>(paymentIdResponseDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentIdResponseDTO>> getPaymentsByUserId(@PathVariable Long userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            
            // Convert the list of Payment entities to PaymentIdResponseDTO objects
            List<PaymentIdResponseDTO> paymentIdResponseDTOs = payments.stream()
                .map(PaymentIdResponseDTO::new)
                .collect(Collectors.toList());
            
            return new ResponseEntity<>(paymentIdResponseDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
