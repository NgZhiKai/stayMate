package com.example.staymate.strategy.payment;

public class StripePaymentStrategy implements PaymentStrategy {

    @Override
    public boolean processPayment(double amount) {
        // Logic for processing Stripe payment
        System.out.println("Processing Stripe payment of " + amount);

        if (amount > 0) {

            return true;
        }

        return false;
    }
}
