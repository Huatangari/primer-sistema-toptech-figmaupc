# Política de Seguridad — TopTech

**Versión**: 1.0
**Clasificación**: Pública (resumen ejecutivo para clientes)
**Revisión**: Anual o tras incidente de seguridad significativo

---

## 1. Principios generales

TopTech aplica el modelo de seguridad **"defensa en profundidad"**: múltiples capas de control técnico y organizacional para proteger los datos de los clientes frente a acceso no autorizado, alteración, pérdida o divulgación.

Los principios que guían todas las decisiones de seguridad son:

- **Mínimo privilegio**: cada usuario y proceso accede solo a lo estrictamente necesario
- **Seguridad por defecto**: la configuración inicial es la más restrictiva; el cliente habilita lo que necesita
- **Aislamiento multi-tenant**: los datos de un cliente son completamente inaccesibles para otros clientes, garantizado a nivel de base de datos mediante Row Level Security (RLS)
- **Trazabilidad**: todas las acciones relevantes quedan registradas en audit logs

---

## 2. Seguridad de la infraestructura

### 2.1 Hosting y red

| Componente | Proveedor | Medidas |
|------------|-----------|---------|
| Frontend | Vercel (Edge Network) | CDN global, DDoS protection, headers de seguridad HTTP |
| Base de datos | Supabase (PostgreSQL) | Cifrado en reposo AES-256, backups cifrados, acceso solo por JWT |
| Almacenamiento | Supabase Storage (S3-compatible) | Acceso por políticas de bucket, URLs firmadas con expiración |
| Edge Functions | Supabase Deno Runtime | Ejecución aislada, sin acceso a sistema de archivos, CORS estricto |

### 2.2 Cifrado

| Nivel | Protocolo | Detalles |
|-------|-----------|---------|
| **En tránsito** | TLS 1.2+ | Todo el tráfico entre cliente y servidor; certificados gestionados automáticamente |
| **En reposo** | AES-256 | Base de datos, backups y archivos en Storage |
| **Contraseñas** | bcrypt (Supabase Auth) | Hash + salt; no se almacenan en texto plano |
| **Tokens JWT** | RS256 | Firmados con clave privada; expiración configurable |

### 2.3 Cabeceras de seguridad HTTP

```
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 3. Control de acceso

### 3.1 Autenticación

- Autenticación gestionada por **Supabase Auth** (basado en GoTrue, estándar de la industria)
- Soporte para: email+contraseña, magic link, SSO con SAML 2.0 (Enterprise)
- Sesiones con **JWT de corta duración** + refresh token rotatorio
- Las contraseñas deben cumplir: mínimo 8 caracteres, al menos una mayúscula y un número
- Bloqueo de cuenta tras 10 intentos fallidos consecutivos
- MFA (2FA por TOTP) disponible y recomendado para cuentas admin

### 3.2 Autorización y roles

| Rol | Permisos |
|-----|---------|
| **Admin** | CRUD completo en todos los módulos del edificio; gestión de usuarios |
| **Técnico** | Crear y actualizar activos, incidentes y documentos; lectura de proveedores |
| **Visor** | Solo lectura en todos los módulos |

El aislamiento entre edificios se implementa mediante **Row Level Security (RLS)** directamente en PostgreSQL. Ninguna consulta puede devolver datos de otro edificio, independientemente del código de aplicación.

### 3.3 Gestión de credenciales del sistema

- Las variables de entorno sensibles se almacenan en **GitHub Secrets** y **Vercel Environment Variables**, nunca en el código fuente
- Las claves de Supabase se rotan cada 12 meses o ante sospecha de compromiso
- El acceso al dashboard de producción de Supabase está restringido por MFA
- No se utilizan credenciales compartidas; cada miembro del equipo tiene acceso individual

---

## 4. Seguridad del desarrollo

### 4.1 Ciclo de desarrollo seguro

- **Revisión de código obligatoria**: toda rama requiere Pull Request aprobado por ≥ 1 revisor antes de merge
- **Pre-commit hooks**: linting y type-checking automático en cada commit (Husky + lint-staged)
- **CI/CD**: pipeline automatizado con lint, type-check, tests unitarios y E2E antes de cada deploy
- **Dependencias**: auditoría con `npm audit` en cada CI run; alertas de Dependabot activadas
- **Secrets en código**: protección automática de GitHub para detectar credenciales accidentalmente commiteadas

### 4.2 OWASP Top 10 — Controles implementados

| Vulnerabilidad | Control |
|----------------|---------|
| A01 — Broken Access Control | RLS en BD; roles en aplicación; tests automatizados de aislamiento |
| A02 — Cryptographic Failures | TLS 1.2+, AES-256, bcrypt para contraseñas |
| A03 — Injection | Queries parametrizadas via Supabase client; sin SQL crudo en aplicación |
| A04 — Insecure Design | Arquitectura multi-tenant revisada; threat modeling por sprint |
| A05 — Security Misconfiguration | Headers HTTP revisados; CORS estricto con whitelist por entorno |
| A06 — Vulnerable Components | Dependabot + npm audit en CI |
| A07 — Auth Failures | JWT rotatorio; bloqueo por intentos fallidos; MFA disponible |
| A08 — Software Integrity | Verificación de integridad en CI; packages con lock file |
| A09 — Logging & Monitoring | Sentry para errores frontend; logs de Edge Functions en Supabase |
| A10 — SSRF | Edge Functions no realizan fetch a URLs arbitrarias del usuario |

---

## 5. Gestión de vulnerabilidades

### 5.1 Reporte responsable

Si descubres una vulnerabilidad en el sistema TopTech, por favor repórtala de forma **responsable** a:

**Email**: seguridad@toptech.app
**PGP Key**: disponible en `toptech.app/.well-known/security.txt`

Nos comprometemos a:
- Acusar recibo en 48 h
- Proporcionar una evaluación inicial en 5 días hábiles
- Mantener comunicación continua hasta la resolución
- No emprender acciones legales contra investigadores de buena fe

### 5.2 Parches de seguridad

| Severidad (CVSS) | Tiempo de parche |
|-----------------|-----------------|
| Crítica (9.0–10.0) | 24 h |
| Alta (7.0–8.9) | 72 h |
| Media (4.0–6.9) | 7 días |
| Baja (0.1–3.9) | Próximo sprint |

---

## 6. Continuidad y recuperación

| Escenario | RTO | RPO | Procedimiento |
|-----------|-----|-----|---------------|
| Fallo de instancia de aplicación | 5 min | 0 | Redeploy automático en Vercel |
| Corrupción de datos en BD | 4 h | 1 h | PITR de Supabase (ver backup-restore.md) |
| Compromiso de credenciales | 30 min | N/A | Rotación inmediata + invalidación de sesiones |
| Ataque DDoS | 15 min | 0 | Cloudflare + protección Vercel Edge |

---

## 7. Cumplimiento normativo

| Marco | Estado | Alcance |
|-------|--------|---------|
| **Ley N.° 29733** (Protección de Datos Personales, Perú) | Cumplimiento | Tratamiento de datos de usuarios |
| **OWASP ASVS Nivel 1** | Cumplimiento parcial → objetivo Nivel 2 en Q3 | Verificación de seguridad de aplicaciones |
| **ISO 27001** | En evaluación para Enterprise | Gestión de seguridad de la información |

---

## 8. Auditoría y logs

- Los **logs de acceso** a la aplicación se conservan 90 días
- Los **audit logs de cambios de datos críticos** (incidentes, activos) se conservan indefinidamente
- Los **logs de autenticación** (logins, intentos fallidos) se conservan 12 meses
- El cliente puede solicitar los logs correspondientes a sus datos en cualquier momento mediante ticket de soporte

---

## 9. Incidentes de seguridad

En caso de brecha de seguridad que afecte datos del cliente:

1. **Detección y contención** (0–4 h): aislar el vector de ataque, revocar accesos comprometidos
2. **Notificación al cliente** (< 72 h): comunicar el incidente, datos potencialmente afectados y medidas tomadas
3. **Notificación regulatoria**: cumplir con plazos legales aplicables (Ley 29733)
4. **Postmortem** (5 días): causa raíz, línea de tiempo, medidas correctivas

---

## 10. Responsabilidades compartidas

| Responsabilidad | TopTech | Cliente |
|----------------|---------|---------|
| Seguridad de la infraestructura cloud | ✅ | |
| Seguridad del código de la plataforma | ✅ | |
| Gestión de usuarios y contraseñas propios | | ✅ |
| Uso seguro de credenciales entregadas | | ✅ |
| Reporte de incidentes o sospechas | ✅ | ✅ |
| Dispositivos de acceso del cliente | | ✅ |
| Seguridad de redes del cliente | | ✅ |

---

*Para el documento completo de política interna de seguridad (uso interno de TopTech), contactar a seguridad@toptech.app con acuerdo de confidencialidad.*
