# ---- Run stage ----
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the JAR from the previous stage
COPY target/*.jar app.jar

# Expose port
EXPOSE 4200

# Run the app
CMD ["java", "-jar", "app.jar"]
