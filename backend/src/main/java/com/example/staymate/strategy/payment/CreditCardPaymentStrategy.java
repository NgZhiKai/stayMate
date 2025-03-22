package com.example.staymate.strategy.payment;

public class CreditCardPaymentStrategy implements PaymentStrategy {

    @Override
    public boolean processPayment(double amount) {
        // Logic for processing credit card payment
        System.out.println("Processing Credit Card payment of " + amount);

        if (amount > 0) {

            return true;
        }

        return false;
    }
}
