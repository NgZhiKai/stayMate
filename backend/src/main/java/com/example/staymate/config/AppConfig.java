package com.example.staymate.config;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.host_ip}")
    private String hostIp; // The host IP (or hostname)

    @Bean
    public String dynamicBaseUrl() throws UnknownHostException {
        String baseUrl;

        if (hostIp != null && !hostIp.isEmpty()) {
            // Resolve the host IP to an actual address (IP address)
            InetAddress inetAddress = InetAddress.getByName(hostIp);
            String ipAddress = inetAddress.getHostAddress(); // Get the IP address

            // Check if the resolved IP address is valid and update the base URL
            if (ipAddress != null && !ipAddress.isEmpty()) {
                baseUrl = "http://" + ipAddress; // Update the base URL dynamically
            } else {
                // If resolving fails, you could log an error or fallback to default
                baseUrl = "http://localhost"; // Default fallback
            }
        } else {
            baseUrl = "http://localhost"; // Default fallback if no host IP is provided
        }

        return baseUrl; // Return the dynamically generated base URL
    }
}
