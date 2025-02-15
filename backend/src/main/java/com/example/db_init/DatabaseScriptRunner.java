package com.example.db_init;

import java.sql.SQLException;

public class DatabaseScriptRunner {

    public static void main(String[] args) {
        DatabaseScriptExecutor scriptExecutor = new DatabaseScriptExecutor();
        try {
            String scriptPath = "src/main/resources/create_schema.sql";
            scriptExecutor.executeScript(scriptPath);
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Database initialization failed");
        }
    }
}
