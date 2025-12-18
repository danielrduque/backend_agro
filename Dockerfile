# ================================
# Backend NestJS - Multi-stage build
# ================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar TODAS las dependencias (build necesita devDependencies)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Solo dependencias de producción
RUN npm ci --omit=dev

# Copiar build desde stage anterior
COPY --from=builder /app/dist ./dist

# Definir explícitamente el puerto que usará NestJS
ENV PORT=3001

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001

USER nestjs

# Puerto documentado
EXPOSE 3001

# Comando de inicio
CMD ["node", "dist/main.js"]
