package com.example.staymate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:database-config.properties")  // Load the external properties file
public class StaymateApplication {

    public static void main(String[] args) {
        SpringApplication.run(StaymateApplication.class, args);
    }
}
