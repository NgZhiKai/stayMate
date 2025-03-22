package com.example.staymate.strategy.payment;

public class PaypalPaymentStrategy implements PaymentStrategy {

    @Override
    public boolean processPayment(double amount) {
        // Logic for processing PayPal payment
        System.out.println("Processing PayPal payment of " + amount);

        if (amount > 0) {

            return true;
        }

        return false;
    }
}