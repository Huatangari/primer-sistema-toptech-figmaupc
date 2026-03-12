# RELEASE

## Versionado

Se recomienda SemVer: `MAJOR.MINOR.PATCH`.

## Flujo de release

1. Congelar cambios en `develop`.
2. Validar calidad completa:

```bash
npm run check
npm run test:e2e
```

3. Crear PR `develop -> main`.
4. Aprobar y mergear.
5. Etiquetar release:

```bash
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

6. Verificar deploy a produccion.
7. Publicar notas tecnicas al cliente.

## Release notes minimas

- Cambios funcionales
- Cambios tecnicos relevantes
- Migraciones DB aplicadas
- Riesgos conocidos
- Plan de rollback

## Hotfix

1. Crear `hotfix/*` desde `main`.
2. PR a `main` con aprobacion.
3. Deploy inmediato.
4. Back-merge `main -> develop`.
