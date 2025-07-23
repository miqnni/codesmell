FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk

ARG JAR_FILE=target/*.jar

COPY --from=build /app/${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]