# Plan de Onboarding — TopTech

**Versión**: 1.0
**Cliente**: _______________
**Plan contratado**: _______________
**Fecha de inicio**: _______________
**Customer Success Manager**: _______________

---

## Resumen ejecutivo

El onboarding de TopTech está diseñado para que el edificio esté **100 % operativo en 10 días hábiles**. El proceso se divide en 4 fases: configuración técnica, carga de datos, capacitación y go-live.

| Fase | Días hábiles | Responsable principal |
|------|-------------|----------------------|
| Fase 1 — Setup técnico | Días 1–2 | TopTech |
| Fase 2 — Carga de datos | Días 3–5 | TopTech + Cliente |
| Fase 3 — Capacitación | Días 6–8 | TopTech |
| Fase 4 — Go-live y acompañamiento | Días 9–10 | Compartido |

---

## Fase 1 — Setup técnico (Días 1–2)

**Responsable**: Equipo de TopTech
**Entregable**: Entorno de staging operativo con datos del cliente

### Día 1 — Aprovisionamiento

| Tarea | Responsable | Criterio de completado |
|-------|-------------|----------------------|
| Crear proyecto Supabase del cliente | TopTech | URL del proyecto activo |
| Aplicar schema + RLS (`schema.sql`, `rls.sql`) | TopTech | Tablas creadas, RLS activo |
| Configurar bucket de Storage (documentos) | TopTech | Bucket accesible con políticas correctas |
| Desplegar Edge Functions | TopTech | Funciones respondiendo 200 en `/health` |
| Configurar dominio del cliente | TopTech | `cliente.toptech.app` con SSL |
| Crear usuario admin inicial del cliente | TopTech | Login funciona, rol admin confirmado |

### Día 2 — Verificación y accesos

| Tarea | Responsable | Criterio de completado |
|-------|-------------|----------------------|
| Prueba end-to-end del entorno | TopTech | Flujo login → dashboard → crear incidente OK |
| Entregar credenciales admin al cliente | TopTech | Cliente recibe email con instrucciones seguras |
| Configurar SMTP del cliente (si aplica) | TopTech + Cliente | Emails de invitación llegan a bandeja |
| Confirmar variables de entorno de producción | TopTech | Build de prod con credenciales reales |

**Requisitos del cliente para esta fase**:
- [ ] Nombre oficial del edificio / empresa
- [ ] Logo en formato PNG (mín. 200×200 px) — para Enterprise
- [ ] Email del administrador principal
- [ ] Dominio personalizado deseado (si aplica)

---

## Fase 2 — Carga de datos (Días 3–5)

**Responsable**: Compartido (TopTech proporciona plantillas; cliente completa la información)
**Entregable**: Catálogo inicial de activos, proveedores y usuarios cargado

### Plantillas de importación

TopTech entrega las siguientes plantillas en formato Excel/CSV:

| Plantilla | Campos requeridos | Límite recomendado |
|-----------|------------------|-------------------|
| `activos.xlsx` | nombre, categoría, ubicación, estado, fecha_instalación | Sin límite |
| `proveedores.xlsx` | nombre, categoría, contacto, email, teléfono | Sin límite |
| `usuarios.xlsx` | nombre, email, rol (admin/técnico/visor) | Según plan |
| `documentos.xlsx` | nombre, tipo, fecha_vigencia, url_archivo | Sin límite |

### Proceso de carga

```
Día 3: Cliente completa plantillas con su información actual
Día 4: TopTech revisa calidad de datos y comunica correcciones
Día 5: TopTech ejecuta carga masiva; cliente valida en la plataforma
```

### Checklist de validación de datos (cliente)

- [ ] Todos los activos críticos están registrados con estado correcto
- [ ] Proveedores tienen datos de contacto completos
- [ ] Usuarios tienen el rol adecuado
- [ ] Al menos 1 documento de ejemplo subido y visible

---

## Fase 3 — Capacitación (Días 6–8)

**Formato**: Videollamada (Google Meet / Zoom) + grabación compartida
**Duración por sesión**: 2 horas

### Sesión 1 — Administradores (Día 6)

**Audiencia**: 1–3 personas con rol admin

| Módulo | Duración | Contenido |
|--------|----------|-----------|
| Navegación general | 15 min | Dashboard, menú, perfil |
| Gestión de usuarios | 20 min | Crear, editar, roles, invitaciones |
| Configuración del edificio | 20 min | Datos generales, ajustes |
| Activos: CRUD completo | 25 min | Crear, editar, historial de mantenimiento |
| Preguntas y práctica guiada | 40 min | Casos reales del cliente |

### Sesión 2 — Técnicos y operadores (Día 7)

**Audiencia**: Equipo que gestiona incidentes y documentos día a día

| Módulo | Duración | Contenido |
|--------|----------|-----------|
| Creación y seguimiento de incidentes | 30 min | Flujo completo: abrir → asignar → cerrar |
| Gestión de documentos | 20 min | Subir, categorizar, vencimientos |
| Gestión de proveedores | 20 min | Directorio, vinculación a incidentes |
| Consultas y práctica | 30 min | Escenarios reales del cliente |

### Sesión 3 — Reportes y dashboards (Día 8)

**Audiencia**: Gerencia / dirección

| Módulo | Duración | Contenido |
|--------|----------|-----------|
| Lectura del dashboard | 20 min | KPIs, tendencias, alertas |
| Reportes exportables | 20 min | Generar, filtrar, exportar a PDF/Excel |
| Casos de uso gerencial | 30 min | ¿Qué métricas seguir? ¿Cuándo escalar? |
| Preguntas finales | 30 min | — |

**Material entregado tras cada sesión**:
- Grabación de la sesión (enlace Drive / disponible 90 días)
- Guía de referencia rápida en PDF
- Acceso a `docs.toptech.app` con manual completo

---

## Fase 4 — Go-live y acompañamiento (Días 9–10)

### Día 9 — Go-live supervisado

| Tarea | Responsable |
|-------|-------------|
| Activar acceso de todos los usuarios finales | TopTech + Admin cliente |
| Monitoreo activo de errores en Sentry | TopTech |
| Canal de WhatsApp abierto con respuesta inmediata | TopTech |
| Primera operación real en producción (crear incidente real) | Cliente con soporte TopTech |

### Día 10 — Revisión y cierre

| Tarea | Responsable |
|-------|-------------|
| Revisión de métricas de uso (logins, acciones) | TopTech |
| Resolución de dudas surgidas en el día 1 real | TopTech |
| Entrega del Kit del cliente (ver abajo) | TopTech |
| Firma del acta de go-live | Ambas partes |
| Programar primera revisión mensual | Ambas partes |

---

## Kit del cliente (entregado en Día 10)

- [ ] Credenciales definitivas de admin (vault seguro)
- [ ] Contactos de soporte y escalado (PDF)
- [ ] Manual de usuario completo (PDF + acceso online)
- [ ] Guías rápidas por rol (tarjetas de referencia)
- [ ] Contrato y SLA firmados
- [ ] Política de seguridad y privacidad
- [ ] Acceso al portal de soporte (`soporte.toptech.app`)
- [ ] Calendario de revisiones trimestrales

---

## Acta de go-live

Confirmamos que el sistema TopTech ha sido configurado, los datos han sido migrados, la capacitación ha sido completada y el cliente ha validado el correcto funcionamiento de la plataforma.

| | TopTech | Cliente |
|--|---------|---------|
| **Nombre** | | |
| **Cargo** | | |
| **Fecha** | | |
| **Firma** | | |

**Observaciones**: _______________
