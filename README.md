# Orbit Tasks - Web Application

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

Aplicación web moderna de gestión de tareas construida con Next.js, TypeScript, Prisma y PostgreSQL. Diseñada con un enfoque en rendimiento, type-safety y experiencia de usuario.

## 🚀 Características

- ✅ Gestión completa de tareas (crear, editar, eliminar)
- 📋 Subtareas para organizar mejor tus proyectos
- 🎯 Prioridades (Baja, Media, Alta)
- 📅 Fechas de vencimiento
- 🔄 Estados de tarea (Pendiente, En Progreso, Completada)
- 👤 Sistema de autenticación y perfiles de usuario
- 🎨 Interfaz moderna con Tailwind CSS v4
- 📱 Diseño responsive
- ⚡ Server Components y Server Actions para máximo rendimiento
- 🔒 Autenticación segura con bcrypt y sesiones

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16**: Framework React con App Router para renderizado del servidor
- **React 19**: Biblioteca UI con Server Components
- **TypeScript**: Type-safety en todo el proyecto
- **Tailwind CSS v4**: Estilos utility-first modernos

### Backend
- **Next.js API Routes**: Endpoints RESTful integrados
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Base de datos relacional robusta
- **bcryptjs**: Hashing seguro de contraseñas

### Características Técnicas
- **Server Components**: Renderizado en servidor para mejor rendimiento
- **Server Actions**: Mutaciones de datos sin API routes adicionales
- **Type Safety**: TypeScript + Prisma para seguridad de tipos end-to-end
- **Optimistic Updates**: Actualizaciones instantáneas en la UI

## 📋 Requisitos Previos

- Node.js 20+ 
- PostgreSQL 14+
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd todo-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp env.example .env
```

Edita `.env` y configura:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/todo_app"
```

4. Configura la base de datos:
```bash
npx prisma generate
npx prisma db push
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npx prisma studio` - Abre Prisma Studio para gestionar la base de datos
- `npm run db:push` - Sincroniza el esquema con la base de datos
- `npm run db:migrate` - Ejecuta migraciones de base de datos

## 🗂️ Estructura del Proyecto

```
todo-app/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── (routes)/          # Páginas de la aplicación
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes React reutilizables
│   ├── client/           # Client Components
│   └── server/           # Server Components
├── lib/                  # Utilidades y lógica de negocio
│   ├── auth.ts          # Autenticación y sesiones
│   ├── prisma.ts        # Cliente de Prisma
│   └── task-sort.ts     # Lógica de ordenamiento
├── prisma/              # Esquema y migraciones
│   ├── schema.prisma   # Esquema de base de datos
│   └── migrations/     # Historial de migraciones
└── types/              # Definiciones TypeScript
```

## 🔐 Autenticación

La aplicación utiliza autenticación basada en sesiones con cookies HTTP-only. Los usuarios pueden:
- Registrarse con email y contraseña (hasheada con bcrypt)
- Iniciar sesión de forma segura
- Actualizar su perfil y nombre de usuario
- Cambiar su contraseña
- Eliminar su cuenta (con eliminación en cascada de tareas)

## 📦 Base de Datos

### Esquema
- **Users**: Información de usuarios con autenticación
- **Tasks**: Tareas con relaciones a usuarios y soporte para subtareas

### Características
- Índices optimizados para consultas frecuentes
- Relaciones en cascada para integridad referencial
- Migraciones versionadas con Prisma

Las migraciones de Prisma están en `prisma/migrations/`.

## 🎯 Desafíos y Soluciones

### 1. Type Safety End-to-End
**Desafío**: Mantener type safety desde la base de datos hasta la UI.

**Solución**: 
- Prisma genera tipos TypeScript automáticamente desde el esquema
- Server Components y Server Actions mantienen los tipos en toda la aplicación
- Validación con Zod en formularios

### 2. Optimización de Rendimiento
**Desafío**: Minimizar el tiempo de carga y mejorar la experiencia del usuario.

**Solución**:
- Uso de Server Components para reducir JavaScript del cliente
- Server Actions para mutaciones sin necesidad de API routes adicionales
- Ordenamiento inteligente de tareas en el servidor
- Lazy loading de componentes cuando es apropiado

### 3. Gestión de Estado del Servidor
**Desafío**: Sincronizar el estado entre cliente y servidor sin complejidad innecesaria.

**Solución**:
- Server Components para datos que no cambian frecuentemente
- Client Components solo donde se necesita interactividad
- Revalidación automática después de mutaciones

### 4. Autenticación Segura
**Desafío**: Implementar autenticación segura sin librerías pesadas.

**Solución**:
- Cookies HTTP-only para almacenar sesiones
- Hashing de contraseñas con bcrypt
- Middleware de autenticación reutilizable
- Protección de rutas a nivel de servidor

## 🚀 Despliegue

Para desplegar en producción:

1. Construye la aplicación:
```bash
npm run build
```

2. Configura las variables de entorno en tu plataforma de hosting

3. Ejecuta las migraciones:
```bash
npx prisma migrate deploy
```

4. Inicia el servidor:
```bash
npm start
```

### Plataformas Recomendadas
- **Vercel**: Optimizado para Next.js con despliegue automático
- **Railway**: Fácil configuración de PostgreSQL
- **Render**: Alternativa con buen soporte para Next.js

## 📸 Screenshots

> **Nota**: Añade capturas de pantalla de las principales funcionalidades:
> - Dashboard con estadísticas
> - Lista de tareas con filtros
> - Formulario de creación/edición
> - Perfil de usuario

## 📄 Licencia

Este proyecto es privado.
