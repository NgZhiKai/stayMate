package com.example.staymate.config;

import java.io.InputStreamReader;
import java.net.URL;
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
            String ipAddress = resolvePublicIpAddress(hostIp);

            // If a public IP address is successfully resolved, update the base URL
            if (ipAddress != null && !ipAddress.isEmpty()) {
                baseUrl = "http://" + ipAddress; // Update the base URL dynamically
            } else {
                // If resolving fails, fallback to a default value
                baseUrl = "http://localhost"; // Default fallback
            }
        } else {
            baseUrl = "http://localhost"; // Default fallback if no host IP is provided
        }

        return baseUrl; // Return the dynamically generated base URL
    }

    /**
     * Resolves the public IP address of the given hostname (EC2 instance).
     * If running within EC2, this fetches the public IP using the EC2 metadata
     * service.
     */
    private String resolvePublicIpAddress(String hostIp) {
        String ipAddress = null;

        try {
            // If we are on EC2, we fetch the public IP from the EC2 metadata service
            if (hostIp.contains("ec2")) {
                // Fetch public IP from the EC2 metadata service
                URL url = new URL("http://169.254.169.254/latest/meta-data/public-ipv4");
                InputStreamReader reader = new InputStreamReader(url.openStream());
                StringBuilder ip = new StringBuilder();
                int i;
                while ((i = reader.read()) != -1) {
                    ip.append((char) i);
                }
                ipAddress = ip.toString().trim();
            } else {
                // Otherwise, resolve the host IP to a public IP (fallback for non-EC2 cases)
                ipAddress = InetAddress.getByName(hostIp).getHostAddress();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ipAddress;
    }
}
