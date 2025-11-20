# Etapa de construcción
FROM eclipse-temurin:24-jdk AS builder
WORKDIR /app

# Copiamos archivos Maven Wrapper (incluyendo la carpeta .mvn)
COPY . .

# Instalamos utilidades necesarias
RUN ./mvnw clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:24-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]