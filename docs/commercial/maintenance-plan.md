# Plan de Mantenimiento Evolutivo Trimestral — TopTech

**Versión**: 1.0
**Periodicidad**: Trimestral (enero, abril, julio, octubre)
**Audiencia**: Cliente + Equipo TopTech

---

## 1. Filosofía del mantenimiento

El mantenimiento de TopTech sigue el modelo **"evergreen SaaS"**: el cliente siempre tiene la última versión del Software sin costo adicional. No existen versiones congeladas ni actualizaciones opcionales pagadas.

Los ciclos trimestrales permiten planificar mejoras evolutivas con visibilidad anticipada, manteniendo un equilibrio entre estabilidad operacional e innovación continua.

---

## 2. Tipos de mantenimiento

| Tipo | Descripción | Frecuencia | Notificación |
|------|-------------|------------|--------------|
| **Correctivo** | Corrección de bugs según SLA de severidad | Bajo demanda | Inmediata (P1/P2) / 24 h (P3/P4) |
| **Preventivo** | Actualización de dependencias, parches de seguridad | Mensual | 48 h antes |
| **Adaptativo** | Cambios por actualizaciones de infraestructura (Supabase, Vercel) | Según terceros | 7 días antes |
| **Evolutivo** | Nuevas funcionalidades, mejoras de UX, integraciones | Trimestral | Sprint de planificación (ver §4) |

---

## 3. Calendario de ventanas de mantenimiento

### Ventana regular (mensual)
- **Día**: primer miércoles de cada mes
- **Hora**: 23:00 – 02:00 (UTC-5, hora Lima)
- **Duración máxima**: 3 horas
- **Impacto**: degradación posible; se notifica 48 h antes

### Ventana de emergencia (cuando aplique)
- Sin calendario fijo
- Notificación con máximo tiempo posible (mínimo 2 h)
- Solo para parches de seguridad críticos (CVSS ≥ 9.0) o incidentes P1

### Días sin mantenimiento (congelamiento de cambios)
- Últimas 2 semanas del mes de cierre fiscal del cliente (a coordinar)
- Semana del go-live inicial
- Períodos de alta operación declarados por el cliente con 15 días de antelación

---

## 4. Ciclo evolutivo trimestral

### Semana -4 (4 semanas antes del trimestre)
**Actividad**: Revisión de backlog y propuestas

| Tarea | Responsable |
|-------|-------------|
| TopTech comparte listado de funcionalidades planificadas para el trimestre | TopTech |
| Cliente revisa y prioriza según necesidades operacionales | Cliente |
| Cliente puede proponer nuevas funcionalidades para evaluación | Cliente |
| TopTech evalúa viabilidad técnica y esfuerzo estimado | TopTech |

### Semana -2 (2 semanas antes del trimestre)
**Actividad**: Confirmación del sprint trimestral

| Tarea | Responsable |
|-------|-------------|
| Reunión de planificación trimestral (1 h, videollamada) | Ambas partes |
| Confirmación del roadmap del trimestre | TopTech |
| Firma del alcance acordado para el período | Ambas partes |

### Durante el trimestre
**Actividad**: Desarrollo y entregas incrementales

- Sprints de 2 semanas; el cliente recibe actualizaciones en staging cada sprint
- Demo quincenal opcional (30 min) para validar funcionalidades nuevas antes de ir a prod
- Canal de feedback abierto durante todo el período

### Semana del cierre trimestral
**Actividad**: Retrospectiva y entrega formal

| Tarea | Responsable |
|-------|-------------|
| Informe de lo entregado vs. planificado | TopTech |
| Revisión de métricas de uso y performance | Ambas partes |
| Identificación de ajustes o deuda técnica | Ambas partes |
| Inicio del ciclo siguiente | TopTech |

---

## 5. Roadmap orientativo por año de contrato

> Los ítems son orientativos. El roadmap real se define y confirma en cada ciclo de planificación trimestral con el cliente.

### Año 1 — Consolidación

| Trimestre | Foco | Funcionalidades orientativas |
|-----------|------|------------------------------|
| **Q1** | Core operacional | Gestión completa de activos, incidentes y documentos |
| **Q2** | Eficiencia | Filtros avanzados, exportación PDF/Excel, notificaciones por email |
| **Q3** | Visibilidad | Dashboard mejorado, reportes programados, KPIs configurables |
| **Q4** | Integraciones | API pública documentada, webhook de eventos, importación masiva |

### Año 2 — Escalado

| Trimestre | Foco | Funcionalidades orientativas |
|-----------|------|------------------------------|
| **Q1** | Multi-edificio | Vista consolidada, reportes por cartera de edificios |
| **Q2** | Automatización | Alertas automáticas por vencimiento, mantenimiento predictivo |
| **Q3** | Movilidad | App móvil (PWA) o cliente nativo según demanda |
| **Q4** | Inteligencia | Análisis de tendencias, sugerencias basadas en historial |

---

## 6. Gestión de solicitudes de cambio (RFC)

Para funcionalidades fuera del roadmap estándar, el proceso es:

```
1. Cliente envía solicitud vía ticket con descripción y justificación de negocio
2. TopTech evalúa impacto técnico y esfuerzo (respuesta en 5 días hábiles)
3. Si el esfuerzo es > 8 h, se cotiza como desarrollo adicional
4. Si se aprueba, entra al backlog del próximo sprint disponible
5. Cliente acepta estimación por escrito antes del inicio del desarrollo
```

### Clasificación de solicitudes

| Tipo | Criterio | Incluido en contrato |
|------|----------|----------------------|
| **Minor enhancement** | < 2 h de desarrollo, mejora de funcionalidad existente | Hasta 4 por trimestre (Pro/Enterprise) |
| **New feature** | > 2 h, nueva funcionalidad no contemplada | Cotización adicional |
| **Integration** | Conexión con sistema externo del cliente | Cotización adicional |
| **Customization** | Cambio de UI/UX específico para el cliente | Enterprise incluido; cotización resto |

---

## 7. Actualizaciones de seguridad (fuera del ciclo trimestral)

Las actualizaciones de seguridad no siguen el ciclo trimestral y se aplican según los tiempos del SLA:

| Severidad CVSS | Tiempo máximo de parche | Comunicación |
|----------------|------------------------|--------------|
| Crítica (9–10) | 24 h | Email inmediato + WhatsApp |
| Alta (7–8.9) | 72 h | Email en 24 h |
| Media (4–6.9) | 7 días hábiles | En el informe semanal |
| Baja (< 4) | Próximo mantenimiento mensual | En changelog mensual |

---

## 8. Comunicaciones periódicas

| Comunicación | Frecuencia | Canal | Contenido |
|-------------|------------|-------|-----------|
| Changelog de actualizaciones | Mensual | Email | Lista de cambios, mejoras y bugs corregidos |
| Informe de disponibilidad | Mensual | Email | Uptime real vs. SLA, incidentes del mes |
| Newsletter de producto | Trimestral | Email | Novedades, próximas funcionalidades, casos de uso |
| Reunión de revisión | Trimestral | Videollamada | Retrospectiva + planificación del siguiente período |
| Alerta de deprecación | Con 60 días de antelación | Email | Cambios breaking en API o UI |

---

## 9. Escalado de versiones (upgrades de plan)

Si el cliente necesita migrar a un plan superior:

| Acción | Proceso | Tiempo |
|--------|---------|--------|
| Upgrade de plan | Solicitud por email → factura prorrateada → activación | 24 h hábiles |
| Agregar edificios | Solicitud → configuración → datos cargados | 2–5 días hábiles |
| Agregar usuarios | Autoservicio desde el dashboard (admin) | Inmediato |
| Ampliar almacenamiento | Solicitud → ajuste de plan → factura diferencial | 24 h hábiles |

---

## 10. Fin de vida (EOL) de funcionalidades

Cuando TopTech decida discontinuar una funcionalidad:

1. **Aviso con 90 días de antelación** por email y en el changelog
2. Período de transición con ambas versiones activas (cuando sea posible)
3. Documentación del proceso de migración de datos afectados
4. Soporte durante el período de transición sin costo adicional

---

## Historial de versiones del plan

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | _______________ | Versión inicial |

---

*Para proponer ajustes a este plan o solicitar una reunión de planificación anticipada, contactar a: csm@toptech.app*
