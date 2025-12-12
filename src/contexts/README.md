## 1. 🟢 Checklist de Pureza de la Capa de Dominio (`domain/`)

Esta es el alma de tu aplicación. Contiene la lógica de negocio, reglas y estructuras de datos más importantes. **No debe depender de NADA fuera de ella.**

### 1. Independencia Total

- ✅ **Contenido permitido:** Entities, Value Objects (VOs), Interfaces (Puertos de Dominio), Errors, y Lógica/Reglas puras.
- ❌ **Prohibición:** **No depende de NestJS, Prisma, HTTP, ni librerías técnicas.** Solo de TypeScript y reglas de negocio.

### 2. Inmutabilidad y Consistencia

- ✅ Los **Value Objects** son `readonly` y validan su estado en el constructor.
- ✅ Las **Entities** validan su estado usando reglas del Dominio en sus constructores o métodos de fábrica (`Factory`).
- ❌ **No hay mutaciones arbitrarias** (solo a través de métodos de la Entidad que aplican reglas).

### 3. Separación Semántica

- ✅ El Dominio solo expone **Contratos** y **Reglas**.
- ❌ **El dominio no conoce la aplicación ni la infraestructura.** La lógica de negocio vive aquí, no en `application/`.
- ❌ **No hay fugas técnicas** (ej. `Prisma`, DTOs de API, decoradores de NestJS).

---

## 2. 🟡 Checklist de Pureza de la Capa de Aplicación (`application/`)

Contiene la lógica de orquestación. Define qué se puede hacer con el dominio (Casos de Uso) y los contratos (Puertos).

### 1. Aislamiento Tecnológico

- ✅ **Solo conoce contratos (ports)** y **objetos de intención (commands/queries)**.
- ❌ **No depende de NestJS, Prisma ni librerías técnicas.**
- ❌ **Prohibición:** Los Casos de Uso **NUNCA** deben importar la implementación del Adaptador (ej. `PrismaUserRepository`). Solo se inyecta la Interfaz (`IUserRepository`).

### 2. Contratos con el Dominio

- ✅ Los **Puertos** (`IUserRepository`) referencian y devuelven **Entidades de Dominio** puras.
- ❌ **Prohibición:** Los Puertos **NO** pueden usar tipos o modelos de la Capa de Infraestructura (ej. devolver un `PrismaUser`).

### 3. Lógica y Estado

- ✅ Los **Usecases** orquestan el flujo de pasos, pero **no validan reglas de negocio** (eso está en `domain/`).
- ✅ **Todo es inmutable y explícito:** `Commands/Queries` son `readonly`, y los Casos de Uso no tienen estado compartido.

---

## 3. 🟠 Checklist de Pureza de la Capa de Infraestructura (`infrastructure/`)

Esta capa contiene los Adaptadores que implementan los Puertos. Es la única capa que conoce la tecnología (BD).

### 1. Implementa, No Define

- ✅ **Implementación Fiel:** Solo implementa los contratos (ports) de `application/` (ej. `implements IUserRepository`).
- ❌ **Prohibición:** **No crea nuevos métodos** en el Repositorio que no estén definidos en el Puerto, ni define reglas de negocio.
- ❌ **No contiene lógica de negocio** (ej. validación de stock, precios, slugs). Toda regla está en `domain/`.

### 2. Dependencias Técnicas Aisladas

- ✅ **Aislamiento:** Prisma, PostgreSQL, librerías externas → **solo se usan aquí**.
- ❌ **Prohibición:** Los imports de estas librerías **nunca** aparecen en `application/` ni `domain/`.

### 3. Mappers Explícitos y Obligatorios

- ✅ **Traducción Obligatoria:** El Repositorio debe usar **Mappers** para traducir `DB Model` $\leftrightarrow$ `Domain Entity`.
- ✅ **Retornos Puros:** El Repositorio **siempre** devuelve Entidades de Dominio o `void`/`null`.
- ❌ **No expone** DTOs ni modelos técnicos fuera de la capa.

  # 4. 🔴 Checklist de Pureza de la Capa API (`api/`)

La Capa API es el **Adaptador de Entrada**. Su función es convertir la petición externa (HTTP) en una acción interna (`Command` o `Query`) y viceversa, sin que las capas internas conozcan el protocolo.

### 1. Mediación, No Lógica (Regla Central)

- ✅ **Solo inyecta Casos de Uso** (Handers) y **Mappers de API**.
- ❌ **No inyecta Repositorios** (eso es lógica de la Capa de Aplicación/Infraestructura).
- ❌ **No contiene lógica de negocio** (ej. cálculo de precios, validación de inventario).

### 2. Aislamiento del Protocolo

- ✅ Los **DTOs de Petición/Respuesta** (`*.request.dto.ts`, `*.response.dto.ts`) son los únicos lugares con decoradores de NestJS (`@Body()`, `@Post()`) y de validación de red (`class-validator`).
- ❌ **Nunca expone** Entidades de Dominio (`UserEntity`) directamente en la respuesta HTTP; siempre se usa un **DTO de Respuesta** mapeado.

### 3. Mapeo Estricto

- ✅ Los **Mappers de API** (`*api.mapper.ts`) son obligatorios para traducir `Request DTO` $\rightarrow$ `Command` y `Output DTO` $\rightarrow$ `Response DTO`.
- ❌ El **Controller NUNCA debe pasar el DTO de la petición** (`req.body`) directamente al Caso de Uso; debe pasarlo como un objeto `Command` bien formado.

### 4. Composition Root (Module)

- ✅ El **Módulo** (`*.module.ts`) es el único responsable de la inyección de dependencias (IoC), "conectando" el Puerto de `application/` con la implementación del Adaptador de `infrastructure/`.
- ❌ El **Módulo no debe contener ninguna lógica de negocio o consulta a BD**.
