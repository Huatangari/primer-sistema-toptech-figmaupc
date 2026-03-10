Quiero que construyas desde cero, en esta carpeta vacía, un frontend demo profesional para presentar un SaaS de gestión técnica de edificios.

CONTEXTO DEL PRODUCTO
El sistema está orientado a juntas directivas de edificios residenciales.
La visión futura es SaaS multi-edificio, pero esta demo será para un solo edificio.
El objetivo de esta primera versión es SOLO FRONTEND, sin backend real por ahora.
No conectes base de datos, no implementes autenticación real, no uses APIs externas.
Todo debe funcionar con mock data local y estructura preparada para crecimiento futuro.

OBJETIVO DE LA DEMO
Necesito una experiencia visual convincente, amigable, moderna, modular y escalable para una reunión comercial.
Debe parecer un producto real listo para evolucionar.
La demo debe mostrar control, orden, trazabilidad y profesionalización de la gestión técnica del edificio.

STACK Y DECISIONES TECNICAS
Usa este stack:
- Next.js actual con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui para componentes base
- lucide-react para íconos
- datos simulados locales
- estructura por módulos
- diseño responsive
- sin backend
- sin Supabase todavía
- sin login funcional real

Si necesitas inicializar dependencias y configuración, hazlo automáticamente en esta carpeta.

REQUISITOS DE UX/UI
Quiero una UI institucional, moderna, limpia y clara.
Debe sentirse como un SaaS B2B profesional.
No quiero una interfaz recargada.
Debe priorizar:
- claridad visual
- jerarquía de información
- navegación simple
- consistencia entre pantallas
- componentes reutilizables
- escalabilidad futura

PALETA Y ESTILO
Usa una estética sobria y profesional:
- azul oscuro / slate como base institucional
- grises claros para fondos
- verde para estados correctos
- amarillo para advertencias
- rojo para incidencias críticas

Usa:
- tarjetas limpias
- badges de estado
- tablas modernas
- tabs
- paneles de detalle
- timeline visual
- botones claros
- diseño responsive real

PRODUCTO A MODELAR
El sistema gestiona:
1. activos del edificio
2. incidencias o fallas
3. evidencias fotográficas
4. documentos técnicos
5. proveedores
6. reportes ejecutivos

TIPOS DE ACTIVOS A SIMULAR
Incluye datos simulados para categorías como:
- ascensores
- extintores
- CCTV
- sistema eléctrico
- bombas de agua
- alarmas contra incendio
- internet
- áreas comunes

ESTRUCTURA DE NAVEGACION
Crea un layout principal con:
- sidebar lateral izquierda
- topbar superior
- contenedor principal responsive

Menú lateral:
- Dashboard
- Activos
- Incidencias
- Documentos
- Proveedores
- Reportes
- Configuración

Aunque algunos módulos sean demo, todos deben verse coherentes.

PANTALLAS A CONSTRUIR

1) LOGIN DEMO
- pantalla elegante y simple
- logo o isotipo textual del producto
- nombre del sistema
- subtítulo corto
- campos email y contraseña
- botón ingresar
- NO autenticación real, solo navegación demo al dashboard

2) DASHBOARD
Debe ser la pantalla más fuerte de la demo.
Debe incluir:
- nombre del edificio
- resumen ejecutivo del estado técnico
- cards KPI:
  - total de activos
  - incidencias abiertas
  - incidencias cerradas
  - documentos registrados
- bloque de estado por categoría
- lista de incidencias recientes
- activos críticos
- alertas o riesgos detectados
- una tarjeta visual tipo “salud técnica del edificio”

3) ACTIVOS - LISTADO
- buscador
- filtros por categoría y estado
- botón “nuevo activo”
- vista profesional con cards o tabla moderna
- mostrar nombre, categoría, ubicación, estado, último mantenimiento
- botón para ver detalle

4) ACTIVO - DETALLE
Debe tener estructura con tabs:
- Resumen
- Historial
- Documentos
- Incidencias

En Resumen mostrar:
- nombre
- código
- categoría
- ubicación
- estado
- fecha de instalación
- descripción
- observaciones

En Historial mostrar timeline demo con eventos.
En Documentos mostrar archivos simulados.
En Incidencias mostrar incidencias asociadas.

5) INCIDENCIAS - LISTADO
- listado visual claro
- filtros por estado, prioridad y categoría
- botón “registrar incidencia”
- cada incidencia debe mostrar:
  - título
  - activo asociado
  - fecha
  - prioridad
  - estado
  - mini preview o indicador de evidencia

6) REGISTRAR INCIDENCIA
- formulario amigable
- campos:
  - activo relacionado
  - título
  - descripción
  - prioridad
  - adjuntar evidencia
  - observaciones
- simular carga de imagen con preview local
- no guardar realmente en backend; usar estado local o mock behavior

7) INCIDENCIA - DETALLE
- encabezado con estado y prioridad
- resumen del caso
- activo relacionado
- evidencia fotográfica
- timeline del caso
- acciones realizadas
- cierre simulado

8) DOCUMENTOS
- repositorio documental técnico
- filtros por tipo de documento
- tabla o grid profesional
- tipos simulados:
  - manual
  - certificado
  - contrato
  - informe técnico
  - plano
- permitir ver detalle visual del documento o panel lateral

9) PROVEEDORES
- listado simple pero profesional
- proveedor
- rubro
- contacto
- último servicio
- estado
- debe conectar visualmente con la visión de servicios futuros

10) REPORTES
- página demo con tarjetas de tipos de reportes
- resumen técnico del edificio
- activos registrados
- historial de incidencias
- documentos por categoría
- aunque no exporte, debe verse lista para crecer

ARQUITECTURA DEL CODIGO
Quiero una estructura limpia y escalable.
Organiza por módulos.
Crea algo como:
- app/
- components/layout/
- components/shared/
- components/dashboard/
- components/assets/
- components/incidents/
- components/documents/
- components/providers/
- lib/mock-data/
- lib/types/
- lib/utils/

Usa componentes reutilizables:
- Sidebar
- Topbar
- KPI Card
- Status Badge
- Filter Bar
- Data Table
- Empty State
- Upload Box
- Timeline
- Tabs de detalle
- Drawer o panel lateral si aporta valor

DATOS MOCK
Crea mock data consistente entre módulos.
Ejemplo:
- activos que aparezcan en dashboard
- incidencias relacionadas a activos reales del mock
- documentos vinculados a activos del mock
- proveedores vinculados con servicios
Todo debe parecer una misma base coherente.

CALIDAD DE IMPLEMENTACION
- TypeScript tipado correctamente
- componentes reutilizables
- nombres claros
- código ordenado
- diseño coherente
- responsive desktop y mobile
- sin lógica innecesaria
- sin sobreingeniería

IMPORTANTE
- No quiero backend todavía
- No quiero autenticación real
- No quiero placeholders vacíos sin intención
- No quiero una landing page; quiero una aplicación interna tipo dashboard SaaS
- Quiero que la demo pueda correrse localmente al finalizar
- Quiero que dejes instrucciones finales claras para ejecutar el proyecto

ENTREGABLE FINAL
1. Inicializa el proyecto completo en esta carpeta
2. Implementa la demo frontend navegable
3. Usa datos mock
4. Deja el proyecto listo para ejecutar
5. Al final explícame:
   - qué creaste
   - estructura del proyecto
   - cómo correrlo
   - qué módulos quedaron listos
   - qué puntos están preparados para conectar backend después

Empieza ahora creando el proyecto y construyendo la base completa.