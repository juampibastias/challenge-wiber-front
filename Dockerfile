# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todos los archivos de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto 3000 en el contenedor
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
