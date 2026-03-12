# UAT Checklist — TopTech (Sprint 4)

**Versión**: Sprint 4 — Operación comercial
**Entorno de prueba**: `staging.toptech.app`
**Fecha de UAT**: _______________
**Responsable cliente**: _______________
**Responsable técnico**: _______________

---

## Instrucciones

- Marcar ✅ cuando la funcionalidad es correcta
- Marcar ❌ cuando falla — anotar descripción en la columna "Observaciones"
- Las secciones marcadas **[BLOQUEANTE]** deben pasar al 100 % para aprobar el despliegue a producción

---

## 1. Autenticación [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 1.1 | Login con credenciales válidas → redirige a Dashboard | ☐ | |
| 1.2 | Login con contraseña incorrecta → mensaje de error claro | ☐ | |
| 1.3 | Cierre de sesión → redirige a Login, sesión limpia | ☐ | |
| 1.4 | Acceso directo a `/dashboard` sin sesión → redirige a Login | ☐ | |
| 1.5 | Refresco de página → sesión se mantiene (no cierra sesión) | ☐ | |

---

## 2. Dashboard [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 2.1 | Carga de KPIs: total activos, incidentes abiertos, documentos | ☐ | |
| 2.2 | Datos corresponden al edificio del usuario logueado | ☐ | |
| 2.3 | Gráficos / indicadores visibles sin errores de consola | ☐ | |

---

## 3. Gestión de activos [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 3.1 | Listar activos del edificio | ☐ | |
| 3.2 | Crear activo con todos los campos obligatorios | ☐ | |
| 3.3 | Editar activo existente → cambios persisten al recargar | ☐ | |
| 3.4 | Filtrar activos por categoría / estado | ☐ | |
| 3.5 | Ver historial de mantenimiento de un activo | ☐ | |
| 3.6 | Registrar evento de mantenimiento → aparece en historial | ☐ | |

---

## 4. Gestión de incidentes [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 4.1 | Listar incidentes con filtros por estado y prioridad | ☐ | |
| 4.2 | Crear nuevo incidente → código INC-XXX generado automáticamente | ☐ | |
| 4.3 | Ver detalle de incidente con línea de tiempo de eventos | ☐ | |
| 4.4 | Cerrar incidente → estado cambia a "Resuelto" | ☐ | |
| 4.5 | Incidente cerrado no aparece en lista "Abiertos" | ☐ | |

---

## 5. Gestión de proveedores

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 5.1 | Listar proveedores del edificio | ☐ | |
| 5.2 | Crear proveedor con nombre, categoría y contacto | ☐ | |
| 5.3 | Editar proveedor → cambios persisten | ☐ | |

---

## 6. Gestión de documentos [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 6.1 | Listar documentos del edificio | ☐ | |
| 6.2 | Registrar nuevo documento (PDF ≤ 10 MB) | ☐ | |
| 6.3 | Documento aparece en la lista tras registro | ☐ | |
| 6.4 | Intentar registrar archivo > límite → mensaje de error claro | ☐ | |

---

## 7. Configuración / Perfil

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 7.1 | Acceder a página de Configuración | ☐ | |
| 7.2 | Información del edificio visible | ☐ | |

---

## 8. Aislamiento multi-tenant [BLOQUEANTE]

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 8.1 | Usuario del Edificio A no ve datos del Edificio B | ☐ | |
| 8.2 | Intentar acceder a `/assets?building=otro-id` → sin datos o error | ☐ | |

---

## 9. Responsive / UX

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 9.1 | Dashboard usable en móvil (375 px) | ☐ | |
| 9.2 | Formularios usables en tablet (768 px) | ☐ | |
| 9.3 | Navegación lateral colapsable en pantallas pequeñas | ☐ | |

---

## 10. Performance / Observabilidad

| # | Caso de prueba | Resultado | Observaciones |
|---|----------------|-----------|---------------|
| 10.1 | Carga inicial de la app < 3 s en red 4G simulada | ☐ | |
| 10.2 | Error inducido → aparece en Sentry (verificar dashboard) | ☐ | |
| 10.3 | Sin errores en consola del navegador en flujos normales | ☐ | |

---

## Resumen de aprobación

| Sección | Total casos | Aprobados | Rechazados | Estado |
|---------|-------------|-----------|------------|--------|
| 1. Autenticación | 5 | | | |
| 2. Dashboard | 3 | | | |
| 3. Activos | 6 | | | |
| 4. Incidentes | 5 | | | |
| 5. Proveedores | 3 | | | |
| 6. Documentos | 4 | | | |
| 7. Configuración | 2 | | | |
| 8. Multi-tenant | 2 | | | |
| 9. Responsive | 3 | | | |
| 10. Performance | 3 | | | |
| **TOTAL** | **36** | | | |

---

## Decisión de go/no-go

- [ ] **GO** — Todas las secciones [BLOQUEANTE] al 100 %, resto ≥ 80 %
- [ ] **NO-GO** — Hay casos bloqueantes fallidos → abrir issues, re-testear

**Firma cliente**: _______________  **Fecha**: _______________
**Firma técnico**: _______________  **Fecha**: _______________
