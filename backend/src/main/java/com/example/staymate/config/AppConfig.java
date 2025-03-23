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
            String ipAddress = resolveIpFromHostname(hostIp);

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

    private String resolveIpFromHostname(String hostIp) {

        String[] parts = hostIp.split("\\.", 2);

        // If the hostname contains 'ec2-', remove it, then replace hyphens with dots
        if (parts[0].contains("ec2-")) {
            return parts[0].replace("ec2-", "").replace("-", ".");
        }
        return null; // Return null if it doesn't match the pattern
    }
}
