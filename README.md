# GRVApp – Proyecto Fullstack

Este repositorio contiene un proyecto web fullstack con backend en **Java + Spring Boot** y frontend en **React + TypeScript**, orquestado mediante **Docker**.

## Estructura del proyecto

```
grvapp/
├── backend/        # API REST en Java con Spring Boot
├── frontend/       # Interfaz de usuario en React + Vite
├── docker-compose.yml
└── .env            # Variables de entorno (NO se sube al repo)
```

---

## 🚀 Tecnologías usadas

### Backend
- Java 21
- Spring Boot 3.2
- Spring Security
- Hibernate (JPA)
- PostgreSQL
- JWT (Autenticación)
- MailSender (para verificación de cuenta)
- Dotenv para inyección de variables

### Frontend
- React 19 + Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- i18next (internacionalización)
- Axios

### DevOps
- Docker
- Docker Compose

---

## 📦 Variables de entorno

El archivo `.env` **no está incluido** por razones de seguridad. Debes crearlo manualmente en la carpeta `backend/` y definir allí tus variables sensibles.

### 🔐 Ejemplo de `.env`

```env
# BASE DE DATOS
DATASOURCE_URL=jdbc:postgresql://postgres:5432/tudb
DATASOURCE_USERNAME=tuuser
DATASOURCE_PASSWORD=XXXXXXXXXX

# MAILING
EMAIL_USER=miemail@gmail.com
EMAIL_PASS=mipassword
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# JWT
JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
JWT_EXPIRATION_MS=86400000
```

> ⚠️ **Nunca subas este archivo a Git**. Ya está ignorado vía `.gitignore`.

---

## 🛠️ Cómo iniciar el proyecto

### Requisitos
- Docker y Docker Compose instalados

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/grvapp.git
cd grvapp
```

### 2. Crea el archivo `.env` en `backend/`

```bash
cd backend
touch .env
# Luego copia el contenido de ejemplo mencionado arriba
```

### 3. Vuelve a la raíz y levanta todo con Docker

```bash
cd ..
docker-compose up --build -d
```

### 4. Aplicación corriendo

- **Frontend**: http://localhost:5173  
- **Backend (API)**: http://localhost:8080  
- **Base de datos**: accesible en puerto 5432 (si usas pgAdmin u otra herramienta)

---

## 📂 Scripts de desarrollo

### Frontend

```bash
cd frontend
npm install       # instalar dependencias
npm run dev       # levantar servidor en http://localhost:5173
```

### Backend

Si quieres levantar el backend manualmente (sin Docker):

```bash
cd backend
./mvnw spring-boot:run
```

---

## 🧾 Licencia

MIT © 2025 GRVApp
