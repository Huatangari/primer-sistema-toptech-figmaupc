# Guía de Contribución — BuildTrack

Gracias por contribuir al proyecto. Este documento explica el flujo de trabajo del equipo.

---

## Estrategia de ramas

```
main        ← producción (solo merge desde release/*)
develop     ← integración continua (base para features)
feature/*   ← nuevas funcionalidades
bugfix/*    ← corrección de errores
release/*   ← preparación de versiones
```

**Reglas:**
- Nunca hacer push directo a `main` ni a `develop`.
- Todo cambio entra por Pull Request con al menos 1 aprobación.
- `main` solo recibe merges desde `release/*`.

---

## Flujo de trabajo

### 1. Crear una rama

```bash
# Asegúrate de partir siempre desde develop actualizado
git checkout develop
git pull origin develop

# Feature nueva
git checkout -b feature/nombre-descriptivo

# Corrección de bug
git checkout -b bugfix/descripcion-del-bug
```

### 2. Desarrollar

- Trabaja en tu rama local.
- Haz commits pequeños y frecuentes con mensajes claros.
- Mantén la rama actualizada con develop:

```bash
git fetch origin
git rebase origin/develop
```

### 3. Hacer commits

Seguimos la convención [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>: <descripción corta en imperativo>

[cuerpo opcional]
```

**Tipos válidos:**

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Mejora interna sin cambio de comportamiento |
| `docs` | Documentación |
| `chore` | Tareas técnicas (deps, config, build) |
| `test` | Tests |
| `style` | Formato/lint (sin lógica) |

**Ejemplos:**

```bash
git commit -m "feat: agregar filtro por prioridad en IncidentsList"
git commit -m "fix: corregir fecha hardcodeada en timeAgo()"
git commit -m "docs: actualizar README con instrucciones de Supabase"
git commit -m "chore: actualizar dependencias de Radix UI"
```

### 4. Subir la rama

```bash
git push origin feature/nombre-descriptivo
```

### 5. Crear Pull Request

1. Ve a GitHub → **Pull Requests** → **New pull request**
2. Base: `develop` ← Compare: `feature/tu-rama`
3. Completa el título y descripción
4. Asigna al menos 1 revisor
5. Espera la aprobación antes de hacer merge

---

## Preparar una release

```bash
# Desde develop
git checkout -b release/1.2.0

# Ajustes finales (versión, changelog, etc.)
# ...

# Merge a main y a develop
git checkout main && git merge release/1.2.0
git checkout develop && git merge release/1.2.0

# Tag en main
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin main develop --tags
```

---

## Configuración del entorno local

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/Huatangari/primer-sistema-toptech-figmaupc.git
cd primer-sistema-toptech-figmaupc

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
# Completa .env.local con tus credenciales de Supabase

# 4. Iniciar
npm run dev
```

---

## Estructura del código

Antes de añadir código nuevo, lee [`docs/architecture.md`](docs/architecture.md).

Puntos clave:
- Los servicios en `src/lib/services/` tienen fallback a mock data — no rompas el modo demo.
- Usa `useData()` de `src/app/hooks/useData.ts` para cualquier carga async.
- Las mutaciones van a través de `src/lib/api/endpoints.ts` (Edge Functions).
- Los tipos de la app van en `src/lib/types/index.ts` (camelCase).
- Los tipos de la DB van en `src/lib/types/database.ts` (snake_case).

---

## Preguntas

Abre un Issue en GitHub con la etiqueta `question`.
