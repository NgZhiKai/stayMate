package com.example.staymate.strategy.payment;

public class PaymentContext {

    private PaymentStrategy paymentStrategy;

    // Set the strategy dynamically
    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    // Use the selected strategy to process the payment and return a boolean indicating success or failure
    public boolean executePayment(double amount) {
        if (paymentStrategy != null) {
            return paymentStrategy.processPayment(amount);
        } else {
            throw new IllegalStateException("Payment method not set");
        }
    }
}
