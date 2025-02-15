package com.example.db_init;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.nio.file.Files;
import java.nio.file.Paths;

public class DatabaseConnectionManager {

    private static final String CONFIG_FILE = "src/main/resources/database-config.properties";

    public static Connection getConnection() throws SQLException {
        Properties properties = new Properties();
        try {
            // Load properties from configuration file
            properties.load(Files.newInputStream(Paths.get(CONFIG_FILE)));
            String url = properties.getProperty("db.url.no_schema");
            String username = properties.getProperty("db.username");
            String password = properties.getProperty("db.password");
            String driver = properties.getProperty("db.driver");

            // Load the MySQL JDBC driver (in case it's not auto-loaded)
            Class.forName(driver);
            return DriverManager.getConnection(url, username, password);

        } catch (Exception e) {
            throw new SQLException("Failed to load database configuration or establish a connection", e);
        }
    }
}
