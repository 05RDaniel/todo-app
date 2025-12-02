# Orbit Tasks - Web Application

Aplicación web moderna de gestión de tareas construida con Next.js, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- ✅ Gestión completa de tareas (crear, editar, eliminar)
- 📋 Subtareas para organizar mejor tus proyectos
- 🎯 Prioridades (Baja, Media, Alta)
- 📅 Fechas de vencimiento
- 🔄 Estados de tarea (Pendiente, En Progreso, Completada)
- 👤 Sistema de autenticación y perfiles de usuario
- 🎨 Interfaz moderna con Tailwind CSS v4
- 📱 Diseño responsive

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **Estilos**: Tailwind CSS v4
- **Autenticación**: Session-based con bcrypt

## 📋 Requisitos Previos

- Node.js 20+ 
- PostgreSQL
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

## 🗂️ Estructura del Proyecto

```
todo-app/
├── app/              # Rutas y páginas (App Router)
├── components/       # Componentes React reutilizables
├── lib/             # Utilidades y lógica de negocio
├── prisma/          # Esquema y migraciones de Prisma
└── types/           # Definiciones de tipos TypeScript
```

## 🔐 Autenticación

La aplicación utiliza autenticación basada en sesiones. Los usuarios pueden:
- Registrarse con email y contraseña
- Iniciar sesión
- Actualizar su perfil
- Cambiar su contraseña
- Eliminar su cuenta

## 📦 Base de Datos

El esquema de la base de datos incluye:
- **Users**: Información de usuarios
- **Tasks**: Tareas con relaciones a usuarios y subtareas

Las migraciones de Prisma están en `prisma/migrations/`.

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

## 📄 Licencia

Este proyecto es privado.
