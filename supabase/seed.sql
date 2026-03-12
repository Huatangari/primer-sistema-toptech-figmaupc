-- =============================================================================
-- TopTech · Seed Data — Multi-tenant Demo
--
-- Crea 2 edificios con datos de prueba.
-- Los usuarios de Supabase Auth deben crearse primero via:
--   supabase.auth.admin.createUser() o el dashboard de Supabase.
--
-- UUIDs fijos para reproducibilidad.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- USUARIOS DE PRUEBA
-- Crear desde el dashboard de Supabase > Authentication > Users
-- o via: supabase auth add-user --email admin@edificio1.com --password demo1234
--
-- edificio_1:
--   admin@torresdelparque.com  / demo1234  → role: admin
--   tecnico@torresdelparque.com / demo1234 → role: technician
--   junta@torresdelparque.com  / demo1234  → role: viewer
--
-- edificio_2:
--   admin@parquecentral.com    / demo1234  → role: admin
-- -----------------------------------------------------------------------------


-- -----------------------------------------------------------------------------
-- EDIFICIOS
-- -----------------------------------------------------------------------------

insert into buildings (id, name, address, floors, units) values
(
  '11111111-1111-1111-1111-111111111111',
  'Torres del Parque',
  'Av. Libertador 1450, CABA',
  14,
  87
),
(
  '22222222-2222-2222-2222-222222222222',
  'Parque Central Residences',
  'Calle Corrientes 3200, CABA',
  18,
  120
);


-- -----------------------------------------------------------------------------
-- PROVEEDORES
-- -----------------------------------------------------------------------------

insert into providers (id, building_id, name, rubro, contact_name, contact_email, contact_phone, status, last_service, rating, contract_type)
values
-- Torres del Parque
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'TecnoAscensores S.A.',
  'Mantenimiento de Ascensores',
  'Carlos Méndez',
  'cmendez@tecnoascensores.com',
  '+54 11 4523-7890',
  'Activo',
  '2025-02-15',
  4.8,
  'Contrato anual'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'Electro Seguridad SRL',
  'Sistemas Eléctricos y CCTV',
  'Ana Rodríguez',
  'arodriguez@electroseg.com',
  '+54 11 3456-1234',
  'Activo',
  '2025-01-20',
  4.5,
  'Contrato semestral'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'AquaServ Ingeniería',
  'Bombas y Sistemas Hidráulicos',
  'Roberto Vidal',
  'rvidal@aquaserv.com',
  '+54 11 6789-0123',
  'Activo',
  '2025-02-28',
  4.2,
  'Contrato anual'
),
-- Parque Central
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '22222222-2222-2222-2222-222222222222',
  'Clima Control SA',
  'HVAC y Ventilación',
  'María Torres',
  'mtorres@climacontrol.com',
  '+54 11 9876-5432',
  'Activo',
  '2025-03-01',
  4.6,
  'Contrato anual'
);


-- ── provider_categories ──────────────────────────────────────────────────────

insert into provider_categories (provider_id, category) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ascensores'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CCTV'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sistema Eléctrico'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Alarmas CI'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bombas de Agua'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Áreas Comunes');


-- -----------------------------------------------------------------------------
-- ACTIVOS — Torres del Parque
-- -----------------------------------------------------------------------------

insert into assets (id, building_id, provider_id, code, name, category, location, status, installation_date, last_maintenance, next_maintenance, description, observations, brand, model, serial_number)
values
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ASC-001',
  'Ascensor Principal Torre A',
  'Ascensores',
  'Hall Principal - Planta Baja',
  'Operativo',
  '2018-03-15',
  '2025-02-15',
  '2025-05-15',
  'Ascensor principal con capacidad para 8 personas. Sistema de tracción eléctrica.',
  'Revisión de frenos completada. Próximo servicio programado.',
  'KONE',
  'MonoSpace 500',
  'KN-2018-1245'
),
(
  'a2222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ASC-002',
  'Ascensor Servicio Torre A',
  'Ascensores',
  'Acceso posterior - Sótano',
  'En Mantenimiento',
  '2018-03-15',
  '2025-01-10',
  '2025-04-10',
  'Ascensor de servicio y mudanzas. Capacidad 1000 kg.',
  'En revisión de sistema hidráulico. Operación suspendida temporalmente.',
  'KONE',
  'TranSys 200',
  'KN-2018-1246'
),
(
  'a3333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'CCTV-001',
  'Sistema CCTV - Hall y Estacionamiento',
  'CCTV',
  'Multiple - Hall, Estacionamiento, Accesos',
  'Operativo',
  '2020-06-01',
  '2025-01-20',
  '2025-07-20',
  '24 cámaras HD distribuidas en hall, estacionamiento y accesos. DVR con 30 días de almacenamiento.',
  'Todas las cámaras operativas. Storage al 60%.',
  'Hikvision',
  'DS-7332HUI-K4',
  'HK-2020-7890'
),
(
  'a4444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'ELEC-001',
  'Tablero Eléctrico Principal',
  'Sistema Eléctrico',
  'Sala Técnica - Sótano B1',
  'Operativo',
  '2018-01-20',
  '2025-02-28',
  '2025-08-28',
  'Tablero trifásico 400A. Distribuye a todos los pisos y áreas comunes.',
  'Última inspección sin observaciones. Certificado vigente hasta agosto 2025.',
  'Schneider Electric',
  'Prisma Plus G',
  'SE-2018-0045'
),
(
  'a5555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'BOMB-001',
  'Bomba de Agua Primaria',
  'Bombas de Agua',
  'Sala de Máquinas - Sótano B2',
  'Falla',
  '2019-05-10',
  '2025-02-01',
  '2025-03-15',
  'Bomba centrífuga de 15 HP para distribución de agua potable en todo el edificio.',
  'FALLA ACTIVA: Presión insuficiente en pisos 10-14. Técnico asignado.',
  'Grundfos',
  'CM5-7',
  'GF-2019-3301'
),
(
  'a6666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'ALARM-001',
  'Sistema Alarma Contra Incendio',
  'Alarmas CI',
  'Central - Sala Seguridad PB',
  'Operativo',
  '2018-03-20',
  '2025-01-15',
  '2025-04-15',
  'Sistema central de detección con 48 detectores de humo y calor. Certificado IRAM.',
  'Certificado de conformidad vigente. Prueba semestral aprobada.',
  'Notifier',
  'AFP-200',
  'NT-2018-0089'
),
(
  'a7777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'EXT-001',
  'Extintores - Planta Baja a Piso 7',
  'Extintores',
  'Pasillos y Zonas de Escape - PB a P7',
  'Vencido',
  '2020-09-01',
  '2023-09-01',
  '2024-09-01',
  'Batería de 14 extintores ABC de 5kg. Distribuidos según plano de seguridad.',
  'VENCIDOS: Recarga y certificación pendiente. Prioridad alta.',
  'Matafuegos SA',
  'Pressurized ABC 5kg',
  null
);


-- -----------------------------------------------------------------------------
-- HISTORIAL DE ACTIVOS — Torres del Parque
-- -----------------------------------------------------------------------------

insert into asset_history (asset_id, building_id, date, type, title, description, technician)
values
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '2025-02-15 09:00:00+00',
  'Mantenimiento',
  'Mantenimiento preventivo anual',
  'Revisión completa de frenos, cables, guías y sistema de control. Todo en condiciones óptimas.',
  'Carlos Méndez'
),
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '2024-02-10 10:00:00+00',
  'Mantenimiento',
  'Mantenimiento preventivo anual 2024',
  'Lubricación de guías, ajuste de frenos y verificación de sistema de iluminación de cabina.',
  'Carlos Méndez'
),
(
  'a5555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '2025-02-01 14:30:00+00',
  'Inspección',
  'Inspección por caída de presión',
  'Detectada caída de presión en pisos superiores. Se identifica desgaste en sello mecánico.',
  'Roberto Vidal'
),
(
  'a7777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '2023-09-01 08:00:00+00',
  'Mantenimiento',
  'Recarga y verificación 2023',
  'Recarga anual realizada. Próxima recarga: septiembre 2024.',
  'Matafuegos SA'
);


-- -----------------------------------------------------------------------------
-- INCIDENCIAS — Torres del Parque
-- -----------------------------------------------------------------------------

insert into incidents (id, building_id, asset_id, code, title, description, priority, status, reported_by, assigned_to, has_evidence, created_at, updated_at)
values
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'a5555555-5555-5555-5555-555555555555',
  'INC-001',
  'Falla de presión en bomba principal',
  'Los residentes de pisos 10 al 14 reportan presión de agua insuficiente. Se escuchan ruidos anormales en sala de máquinas.',
  'Crítica',
  'En Proceso',
  'admin@torresdelparque.com',
  'tecnico@torresdelparque.com',
  true,
  '2025-03-05 08:30:00+00',
  '2025-03-05 14:00:00+00'
),
(
  'e2222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'INC-002',
  'Ascensor de servicio fuera de operación',
  'El ascensor de servicio no responde a llamadas. Panel muestra código de error E-04.',
  'Alta',
  'En Proceso',
  'admin@torresdelparque.com',
  'tecnico@torresdelparque.com',
  false,
  '2025-03-03 11:00:00+00',
  '2025-03-03 11:00:00+00'
),
(
  'e3333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'a7777777-7777-7777-7777-777777777777',
  'INC-003',
  'Extintores vencidos - Requieren recarga urgente',
  'Los 14 extintores de PB a P7 están vencidos desde septiembre 2024. Incumplimiento de normativa de seguridad.',
  'Alta',
  'Abierta',
  'admin@torresdelparque.com',
  null,
  false,
  '2025-03-01 09:00:00+00',
  '2025-03-01 09:00:00+00'
),
(
  'e4444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'a3333333-3333-3333-3333-333333333333',
  'INC-004',
  'Cámara exterior nocturna sin imagen',
  'La cámara del estacionamiento exterior no transmite señal nocturna. Falla en iluminación IR.',
  'Media',
  'Resuelta',
  'tecnico@torresdelparque.com',
  'tecnico@torresdelparque.com',
  true,
  '2025-02-20 16:00:00+00',
  '2025-02-25 10:00:00+00'
);


-- ── incident_events ──────────────────────────────────────────────────────────

insert into incident_events (incident_id, building_id, date, type, description, author)
values
-- INC-001
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '2025-03-05 08:30:00+00',
  'Creación',
  'Incidencia registrada por reporte de residentes de pisos 10-14.',
  'admin@torresdelparque.com'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '2025-03-05 09:00:00+00',
  'Asignación',
  'Asignada a técnico de guardia para inspección inmediata.',
  'admin@torresdelparque.com'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '2025-03-05 14:00:00+00',
  'Actualización',
  'Inspección realizada. Se confirma desgaste en sello mecánico. Se coordinó servicio con AquaServ para el 08/03.',
  'tecnico@torresdelparque.com'
),
-- INC-004
(
  'e4444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '2025-02-20 16:00:00+00',
  'Creación',
  'Reportado fallo de imagen nocturna en cámara exterior.',
  'tecnico@torresdelparque.com'
),
(
  'e4444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '2025-02-25 10:00:00+00',
  'Resolución',
  'Reemplazado módulo LED IR. Cámara operativa con visión nocturna correcta hasta 30m.',
  'tecnico@torresdelparque.com'
);


-- -----------------------------------------------------------------------------
-- DOCUMENTOS — Torres del Parque
-- -----------------------------------------------------------------------------

insert into documents (building_id, asset_id, provider_id, name, type, description, file_size, file_type, tags, uploaded_by, uploaded_at, expires_at)
values
(
  '11111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Certificado de Habilitación - Ascensor Principal 2025',
  'Certificado',
  'Certificado de habilitación y conformidad del ascensor principal emitido por empresa certificadora.',
  '245 KB',
  'PDF',
  '{"certificado", "ascensor", "habilitación", "2025"}',
  'admin@torresdelparque.com',
  '2025-02-16 10:00:00+00',
  '2026-02-15'
),
(
  '11111111-1111-1111-1111-111111111111',
  'a4444444-4444-4444-4444-444444444444',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Certificado Eléctrico - Tablero Principal 2025',
  'Certificado',
  'Certificado de instalación eléctrica conforme a normas IRAM.',
  '189 KB',
  'PDF',
  '{"certificado", "eléctrico", "IRAM", "tablero"}',
  'admin@torresdelparque.com',
  '2025-03-01 09:00:00+00',
  '2025-08-28'
),
(
  '11111111-1111-1111-1111-111111111111',
  'a6666666-6666-6666-6666-666666666666',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Manual Sistema Alarma CI - Notifier AFP-200',
  'Manual',
  'Manual técnico completo del sistema central de alarma contra incendio.',
  '3.2 MB',
  'PDF',
  '{"manual", "alarma", "incendio", "notifier"}',
  'admin@torresdelparque.com',
  '2024-06-15 11:00:00+00',
  null
),
(
  '11111111-1111-1111-1111-111111111111',
  null,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Contrato Mantenimiento TecnoAscensores 2025',
  'Contrato',
  'Contrato de mantenimiento anual preventivo y correctivo de ascensores.',
  '410 KB',
  'PDF',
  '{"contrato", "ascensor", "mantenimiento", "2025"}',
  'admin@torresdelparque.com',
  '2025-01-05 09:00:00+00',
  '2025-12-31'
),
(
  '11111111-1111-1111-1111-111111111111',
  null,
  null,
  'Plano Instalación Eléctrica - Piso Tipo',
  'Plano',
  'Plano técnico de instalación eléctrica del piso tipo (pisos 3-12).',
  '1.8 MB',
  'DWG',
  '{"plano", "eléctrico", "piso tipo"}',
  'admin@torresdelparque.com',
  '2024-11-20 14:00:00+00',
  null
);
