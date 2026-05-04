# Website Jonnattan

Este es el proyecto del sitio web personal y portafolio de Jonnattan. Es una aplicación web moderna construida con **React**, **Vite** y **Material UI**, diseñada para mostrar experimentos técnicos, proyectos personales y proporcionar herramientas interactivas.

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de Single Page Application (SPA) servida a través de un contenedor Docker con Nginx.

```mermaid
graph TD
    User([Usuario]) <--> Browser[Navegador Web]
    subgraph "Contenedor Docker (Frontend)"
        Browser <--> Nginx[Servidor Nginx]
        Nginx <--> ReactApp[React SPA]
    end
    subgraph "Servicios Externos"
        ReactApp <--> API[Backend API]
        ReactApp <--> Maps[Leaflet / OpenStreetMap]
        ReactApp <--> Captcha[hCaptcha]
    end
```

## 🚀 Flujos del Proyecto

### 1. Navegación y Enrutamiento
La aplicación utiliza `react-router-dom` para gestionar la navegación entre las diferentes secciones.

```mermaid
graph LR
    H[Home /] --> E[Experiments /experiments]
    H --> G[Game /game]
    H --> C[Chat /chat]
    H --> S[Status /check]
    H --> P[Private /private]
```

### 2. Flujo de Chat con Verificación (hCaptcha)
Para interactuar con el chat, se requiere una validación de seguridad mediante hCaptcha antes de permitir el envío de mensajes.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (Chat.jsx)
    participant C as hCaptcha Service
    participant B as Backend API

    U->>F: Ingresa mensaje
    U->>C: Completa Captcha
    C-->>F: Retorna Token
    F->>B: Valida Token (POST /page/hcaptcha)
    B-->>F: Confirmación de Validación
    F->>U: Habilita botón "Enviar"
    U->>F: Clic en Enviar
    F->>B: Envía mensaje (POST /waza/message)
    B-->>F: Respuesta del Chat
    F->>U: Muestra respuesta
```

### 3. Acceso a Área Privada (Intranet)
El acceso a la sección `/private` está restringido mediante una verificación de servidor.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend (Intranet.jsx)
    participant B as Backend API

    U->>F: Accede a /private
    F->>F: Estado: Cargando...
    F->>B: Verifica autorización (GET /checkall)
    B-->>F: Retorna datos de servidor
    alt Es servidor autorizado
        F->>U: Muestra Contenido Privado + Curriculum
    else No autorizado
        F->>U: Muestra Alerta de Acceso Restringido
    end
```

### 4. Monitoreo de Servicios (Status Check)
Permite visualizar el estado en tiempo real de varios servicios vinculados al ecosistema del proyecto.

```mermaid
graph TD
    U[Usuario] --> CP[Componente CheckPages]
    CP --> API[apiClient /page/status]
    API --> RES{Respuesta OK?}
    RES -- Sí --> GRID[Renderiza Grid de Monitores]
    RES -- No --> ERR[Muestra mensaje de error]
    GRID --> STATUS[Estado: EN LÍNEA / FUERA DE LÍNEA]
```

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Vite, Material UI (MUI).
- **Mapas:** Leaflet & React-Leaflet.
- **Gráficos:** Recharts.
- **Seguridad:** hCaptcha.
- **Testing:** Vitest & React Testing Library.
- **Despliegue:** Docker & Nginx.

## 📦 Instalación y Desarrollo

### Requisitos
- Node.js (v18+)
- Docker y Docker Compose (para despliegue)

### Desarrollo Local
1. Instalar dependencias:
   ```bash
   cd jonnapp
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Producción con Docker
El proyecto se construye y despliega usando Docker:
```bash
docker-compose up -d --build
```

## ⚙️ Variables de Entorno

El proyecto requiere las siguientes variables configuradas en el entorno (o archivo `.env`):

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | URL base de la API backend |
| `VITE_HCAPTCHA_SITE_KEY` | Clave de sitio para hCaptcha |
| `VITE_AUTH_JONNA_SERVER` | Credenciales Basic Auth para la API |
| `VITE_PAGE_API_KEY` | API Key principal para las páginas |
| `VITE_GEO_API_KEY` | API Key para servicios geográficos |

---
Desarrollado con ❤️ por Jonnattan.
