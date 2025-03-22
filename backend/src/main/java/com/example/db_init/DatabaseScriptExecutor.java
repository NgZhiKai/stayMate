package com.example.db_init;

import java.sql.Connection;
import java.sql.Statement;
import java.sql.SQLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

public class DatabaseScriptExecutor {

    public void executeScript(String scriptPath) throws SQLException {
        try (Connection connection = DatabaseConnectionManager.getConnection();
             Statement statement = connection.createStatement()) {

            // Disable autocommit for transaction management
            connection.setAutoCommit(false);

            // Read and execute the SQL script from the file
            if (Files.exists(Paths.get(scriptPath))) {
                String sqlScript = "";
                try {
                    sqlScript = new String(Files.readAllBytes(Paths.get(scriptPath)), StandardCharsets.UTF_8);
                } catch (IOException e) {
                    System.out.println("Error reading SQL script file: " + e.getMessage());
                    e.printStackTrace();
                    return; // Exit the method if the file cannot be read
                }
                
                String[] sqlStatements = sqlScript.split(";");

                for (String sql : sqlStatements) {
                    if (!sql.trim().isEmpty()) {
                        try {
                            statement.execute(sql.trim() + ";");
                            System.out.println("Executed: " + sql.trim());
                        } catch (SQLException e) {
                            System.out.println("Error executing SQL: " + sql.trim());
                            throw new SQLException("Error executing script", e);
                        }
                    }
                }

                // Commit the transaction after all statements are executed
                connection.commit();
                System.out.println("Database schema created successfully.");
            } else {
                throw new SQLException("SQL script file not found: " + scriptPath);
            }
        } catch (SQLException e) {
            // Log the error and rethrow it or handle it accordingly
            System.out.println("Error during script execution: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow the SQLException
        }
    }
}
