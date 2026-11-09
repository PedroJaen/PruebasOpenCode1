# syntax=docker/dockerfile:1.7
#
# Imagen del backend de PruebasOpenCode1.
# Contexto de build: raíz del repositorio.
#   docker build -f deploy/docker/back.Dockerfile -t pruebasopencode1-back:pre .
#
# La configuración del entorno (perfil, base de datos y secretos) se inyecta en
# tiempo de ejecución; la imagen es la misma para PRE y PRO.

FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace

# Capa de dependencias: solo cambia cuando cambian pom.xml o el wrapper.
COPY back/pom.xml back/mvnw ./
COPY back/.mvn .mvn
RUN chmod +x mvnw

COPY back/src src
RUN ./mvnw -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

# Usuario sin privilegios. El UID coincide con el securityContext de Kubernetes.
RUN addgroup -S -g 10001 app \
    && adduser -S -u 10001 -G app app

WORKDIR /app
COPY --from=build /workspace/target/pruebasopencode1-back.jar /app/app.jar
RUN mkdir -p /app/data && chown -R app:app /app

USER app
EXPOSE 8080

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError" \
    TZ=Europe/Madrid

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
