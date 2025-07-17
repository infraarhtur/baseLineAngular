# Etapa 1: Compilar Angular
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar Angular en modo producción
RUN npm run build -- --configuration production

# ⚠️ Verificar que la carpeta del build se haya generado correctamente
RUN ls -l /app/dist/base-line-angular

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar archivos compilados desde el builder
COPY --from=builder /app/dist/base-line-angular/browser /usr/share/nginx/html

# Configurar Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
