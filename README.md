# FragUI

Biblioteca de componentes React desarrollada con TypeScript.

## Estructura del Proyecto

```
.husky/                  # Git hooks
.github/
 └─ workflows/           # GitHub Actions
dist/                    # Build output
src/
 ├─ assets/             # Assets estáticos
 ├─ components/         # Componentes de la biblioteca
 │   ├─ alert/
 │   │   ├─ tests/
 │   │   ├─ Alert.tsx
 │   │   ├─ Alert.styles.tsx
 │   │   └─ index.ts
 │   └─ button/
 │   └─ .../
 ├─ hooks/              # Hooks genéricos reutilizables
 ├─ types/              # Definiciones de tipos TypeScript
 ├─ theme/              # Sistema de temas
 │   └─ tokens/         # Design tokens
 ├─ utils/              # Utilidades y helpers
 └─ index.ts            # Punto de entrada principal
tests/
 └─ shared/             # Helpers, setup y mocks para testing
docs/
 └─ components/         # Documentación de componentes
```

## Instalación

```bash
npm install
```

## Scripts Disponibles

### Desarrollo

```bash
# Ejecutar Storybook (puerto 6006)
npm run storybook
```

### Build

```bash
# Compilar la biblioteca
npm run build

# Compilar Storybook
npm run build-storybook
```

### Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Linting y Formatting

```bash
# Ejecutar linter
npm run lint

# Ejecutar linter y corregir automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar formato sin modificar
npm run format:check
```

## Storybook

Para visualizar y desarrollar componentes de forma aislada:

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run storybook
   ```

2. Abre tu navegador en [http://localhost:6006](http://localhost:6006)

3. Los stories de cada componente se encuentran en la carpeta del componente con el nombre `ComponentName.stories.tsx`

## Convenciones de Código

Este proyecto sigue el **Airbnb React Style Guide** con las siguientes convenciones:

### Nombres de Archivos
- Usa **PascalCase** para nombres de archivos de componentes

### Nomenclatura de Referencias
- Usa **PascalCase** para componentes React
- Usa **camelCase** para instancias de componentes

### Props
- Usa **camelCase** para nombres de props
- Usa **PascalCase** si el valor de la prop es un componente React
- Define siempre `defaultProps` explícitos para todas las props no requeridas
- Evita usar nombres de props del DOM para propósitos diferentes

**Ejemplo:**
```tsx
// ❌ Malo
<MyComponent style="fancy" />
<MyComponent className="fancy" />

// ✅ Bueno
<MyComponent variant="fancy" />
```

### Auto-cierre de Tags
- Siempre usa auto-cierre en tags sin hijos

```tsx
// ❌ Malo
<Foo variant="stuff"></Foo>

// ✅ Bueno
<Foo variant="stuff" />
```

### Tags Multilínea
- Si el componente tiene propiedades en múltiples líneas, cierra el tag en una nueva línea

```tsx
// ❌ Malo
<Foo
  bar="bar"
  baz="baz" />

// ✅ Bueno
<Foo
  bar="bar"
  baz="baz"
/>
```

### Métodos Internos
- No uses prefijo underscore para métodos internos
- En JavaScript todo es público, el prefijo underscore no proporciona privacidad real

## Git Hooks con Husky

Este proyecto utiliza **Husky** para automatizar verificaciones de calidad de código antes de cada commit.

### ¿Qué es Husky?

Husky es una herramienta que facilita la configuración de **Git hooks** (scripts que se ejecutan automáticamente en momentos específicos del flujo de Git).

### ¿Dónde interviene en el flujo de desarrollo?

Husky interviene en el momento del **commit** (`pre-commit` hook):

1. Ejecutas `git commit`
2. **Antes** de crear el commit, Husky ejecuta automáticamente:
   - `lint-staged` - Solo verifica los archivos que están en staging
3. `lint-staged` ejecuta sobre los archivos modificados:
   - **ESLint** con corrección automática (`--fix`)
   - **Prettier** para formatear el código
4. Si todas las verificaciones pasan ✅, el commit se completa
5. Si hay errores ❌, el commit se cancela y debes corregir los problemas

### Configuración actual

**Hook configurado**: `.husky/pre-commit`

**Archivos verificados**:
- `src/**/*.{ts,tsx}` - ESLint + Prettier
- `src/**/*.{css,md}` - Prettier

Esto garantiza que todo el código que se commitea cumple con los estándares de calidad del proyecto automáticamente, sin necesidad de recordar ejecutar los linters manualmente.

## Conventional Commits

Este proyecto utiliza **Conventional Commits** para mantener un historial de cambios claro y consistente.

### ¿Qué son los Conventional Commits?

Es una convención para escribir mensajes de commit estructurados que facilitan:
- 📝 Generar CHANGELOGs automáticamente
- 🔍 Navegar el historial de cambios fácilmente
- 🚀 Determinar versiones semánticas automáticamente

### Formato

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[nota(s) al pie opcional(es)]
```

### Tipos de commit

- **feat**: Nueva funcionalidad o característica
- **fix**: Corrección de un bug
- **docs**: Cambios solo en documentación
- **style**: Cambios de formato (espacios, punto y coma, etc.)
- **refactor**: Refactorización de código sin cambiar funcionalidad
- **perf**: Mejoras de rendimiento
- **test**: Añadir o corregir tests
- **build**: Cambios en el sistema de build o dependencias
- **ci**: Cambios en configuración de CI/CD
- **chore**: Tareas rutinarias, configuración, etc.

### Ejemplos

```bash
# Nueva funcionalidad
git commit -m "feat(button): add loading state"

# Corrección de bug
git commit -m "fix(alert): correct color contrast in dark mode"

# Documentación
git commit -m "docs: update installation instructions"

# Refactorización
git commit -m "refactor(hooks): simplify useMediaQuery logic"

# Breaking change (cambio importante)
git commit -m "feat(theme)!: redesign token structure

BREAKING CHANGE: theme tokens have been restructured"
```

### Reglas
- Usa minúsculas para el tipo y descripción
- La descripción debe ser concisa (máx. 72 caracteres)
- No uses punto final en la descripción
- Usa el imperativo ("add" no "added" o "adds")

## Tecnologías

- **React 19**
- **TypeScript**
- **Storybook** - Desarrollo de componentes aislados
- **Vitest** - Testing
- **ESLint + Prettier** - Linting y formateo
- **Husky + lint-staged** - Git hooks para control de calidad