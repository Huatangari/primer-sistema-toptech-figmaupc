# Acuerdo de Nivel de Servicio (SLA) — TopTech

**Versión**: 1.0
**Fecha de vigencia**: _______________
**Partes**: TopTech (proveedor) — _______________  (cliente)

---

## 1. Objeto

El presente SLA define los compromisos de disponibilidad, tiempo de respuesta y calidad del servicio de la plataforma TopTech de gestión de edificios (en adelante, "el Servicio"), contratada mediante la modalidad SaaS.

---

## 2. Disponibilidad del servicio

### 2.1 Objetivo de disponibilidad

| Nivel de plan | Disponibilidad garantizada | Equivale a downtime máximo mensual |
|---------------|---------------------------|-------------------------------------|
| **Starter** | 99.5 % | ≈ 3 h 39 min |
| **Professional** | 99.9 % | ≈ 43 min |
| **Enterprise** | 99.95 % | ≈ 21 min |

La disponibilidad se mide mensualmente excluyendo las ventanas de mantenimiento programado notificadas con ≥ 48 h de antelación.

### 2.2 Exclusiones del cálculo

No computan como downtime los períodos causados por:

- Mantenimiento programado notificado (máx. 4 h/mes, fuera de hora pico)
- Fuerza mayor (desastres naturales, cortes globales de infraestructura de terceros)
- Incidentes originados en el cliente (configuración incorrecta, abuso de API, ataques desde sus propias redes)
- Degradación de servicios de terceros fuera del control de TopTech (Supabase, Vercel, Cloudflare)

### 2.3 Monitoreo y reporte

TopTech publica el estado del servicio en tiempo real en `status.toptech.app`. El cliente puede suscribirse a alertas por email o webhook. Los reportes mensuales de disponibilidad se envían automáticamente los primeros 5 días del mes siguiente.

---

## 3. Tiempos de respuesta y resolución

### 3.1 Definición de severidades

| Severidad | Criterio | Ejemplo |
|-----------|----------|---------|
| **P1 — Crítico** | Servicio totalmente inaccesible o pérdida de datos | Login imposible para todos los usuarios, corrupción de BD |
| **P2 — Alto** | Funcionalidad principal degradada, sin workaround disponible | Creación de incidentes falla, documentos no se guardan |
| **P3 — Medio** | Funcionalidad secundaria afectada, workaround disponible | Exportación falla, campo de formulario incorrecto |
| **P4 — Bajo** | Consulta, mejora, bug menor sin impacto operacional | Typo, pregunta de uso, solicitud de funcionalidad |

### 3.2 Tiempos comprometidos

| Severidad | Tiempo de primera respuesta | Tiempo de resolución objetivo |
|-----------|----------------------------|-------------------------------|
| **P1** | 30 min (24/7) | 4 h |
| **P2** | 2 h (horario laboral) | 1 día hábil |
| **P3** | 4 h (horario laboral) | 3 días hábiles |
| **P4** | 1 día hábil | Próximo sprint (≈ 2 semanas) |

**Horario laboral**: lunes a viernes, 09:00–18:00 hora de Lima (UTC-5), excepto feriados peruanos.
**P1**: cobertura 24/7 con guardia de on-call.

---

## 4. Compensaciones por incumplimiento (créditos de servicio)

Si la disponibilidad mensual cae por debajo del objetivo del plan contratado, el cliente recibirá créditos automáticos aplicados a la siguiente factura:

| Disponibilidad real | Crédito aplicado |
|---------------------|-----------------|
| 99.0 % – 99.49 % (Starter) / 99.5 % – 99.89 % (Pro) | 10 % del canon mensual |
| 98.0 % – 98.99 % | 25 % del canon mensual |
| < 98.0 % | 50 % del canon mensual |

Los créditos son la única compensación pactada y no habilitan la resolución anticipada del contrato salvo acuerdo expreso por escrito. El crédito máximo acumulable por mes es el 100 % del canon mensual.

---

## 5. Copias de seguridad y recuperación

| Dato | Frecuencia de backup | Retención | RPO (Recovery Point Objective) | RTO (Recovery Time Objective) |
|------|----------------------|-----------|-------------------------------|-------------------------------|
| Base de datos | Continua (PITR) | 7 días (Pro) / 30 días (Enterprise) | 1 h | 4 h |
| Archivos (Storage) | Diaria | 30 días | 24 h | 8 h |
| Configuración | Por cambio (Git) | Indefinida | Instantáneo | 2 h |

---

## 6. Seguridad y cumplimiento

- Datos cifrados en tránsito (TLS 1.2+) y en reposo (AES-256)
- Autenticación con JWT firmado; sesiones con expiración configurable
- Aislamiento multi-tenant garantizado por Row Level Security en PostgreSQL
- Revisión de vulnerabilidades en cada release (OWASP Top 10)
- Los datos del cliente nunca se utilizan para entrenamiento de modelos de IA ni se comparten con terceros
- Política de retención de datos: los datos se eliminan en un plazo de 30 días tras la terminación del contrato, previa exportación entregada al cliente

---

## 7. Comunicación de incidentes

| Tipo de evento | Canal de notificación | Plazo |
|----------------|----------------------|-------|
| P1 detectado | Email + WhatsApp al contacto técnico | Inmediato (< 15 min) |
| P1 resuelto | Email con postmortem preliminar | Dentro de las 2 h de resolución |
| Postmortem completo | Documento compartido | 5 días hábiles tras resolución |
| Mantenimiento programado | Email | ≥ 48 h antes |
| Mantenimiento de emergencia | Email | ≥ 2 h antes (si hay tiempo) |

---

## 8. Escalado

```
Nivel 1: Soporte técnico (ticket en portal / email)
       ↓ sin resolución en SLA
Nivel 2: Ingeniero senior asignado al cliente
       ↓ sin resolución en SLA
Nivel 3: Tech Lead + CTO
       ↓ P1 sin resolución en 4 h
Nivel 4: Contacto directo del CEO con el cliente
```

Contactos de escalado entregados por separado en el Kit de Onboarding.

---

## 9. Revisión del SLA

Este SLA se revisará anualmente o cuando existan cambios significativos en la arquitectura del Servicio. TopTech notificará cualquier modificación con 30 días de antelación. Si el cliente no manifiesta objeción escrita en ese plazo, se considerará aceptada la nueva versión.

---

## 10. Vigencia y aceptación

Este SLA forma parte integral del Contrato de Servicio suscrito entre las partes y entra en vigor en la fecha indicada en el encabezado.

**Por TopTech**: _______________ Cargo: _______________ Firma: _______________

**Por el cliente**: _______________ Cargo: _______________ Firma: _______________
