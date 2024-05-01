FROM maven:3.8.5-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
COPY --from=build home/app/target/springgc1-0.0.1-SNAPSHOT.jar alumni-app.jar
ENTRYPOINT ["java", "-jar", "alumni-app.jar"]