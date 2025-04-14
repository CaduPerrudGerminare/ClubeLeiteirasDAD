# Use a imagem oficial do PostgreSQL
FROM postgres:latest

# Copia um script de inicialização, se necessário
COPY ./db/CreateDatabase.sql /docker-entrypoint-initdb.d/