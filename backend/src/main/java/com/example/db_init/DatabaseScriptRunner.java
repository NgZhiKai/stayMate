package com.example.db_init;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

public class DatabaseScriptRunner {

    public static void main(String[] args) {
        // Load database configuration from the properties file
        Properties properties = new Properties();
        Connection connection = null;
        Statement statement = null;
        try {
            // Load the database configuration properties
            properties.load(Files.newInputStream(Paths.get("src/main/resources/database-config.properties")));

            String url = properties.getProperty("db.url");
            String username = properties.getProperty("db.username");
            String password = properties.getProperty("db.password");
            String driver = properties.getProperty("db.driver");

            // Load the MySQL JDBC driver (in case it's not auto-loaded)
            Class.forName(driver);

            // Create a connection to the database
            connection = DriverManager.getConnection(url, username, password);
            statement = connection.createStatement();

            // Read and execute the SQL script from the file
            String scriptPath = "src/main/resources/create_schema.sql";
            if (Files.exists(Paths.get(scriptPath))) {
                String sqlScript = new String(Files.readAllBytes(Paths.get(scriptPath)), StandardCharsets.UTF_8);

                // Split the script into individual SQL statements using ';'
                String[] sqlStatements = sqlScript.split(";");

                // Execute each SQL statement one by one
                for (String sql : sqlStatements) {
                    if (!sql.trim().isEmpty()) {
                        try {
                            statement.execute(sql.trim());  // Execute each statement
                            System.out.println("Executed: " + sql.trim());
                        } catch (Exception e) {
                            System.out.println("Error executing SQL: " + sql.trim());
                            e.printStackTrace();
                        }
                    }
                }
                System.out.println("Database schema created successfully.");
            } else {
                System.out.println("SQL script file not found: " + scriptPath);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // Ensure resources are always closed
            try {
                if (statement != null) {
                    statement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}