nforme de Auditoría Full-Stack: Frontend ↔ Backend
Fecha: 26/12/2025
Metodología: Verificación cruzada Frontend (Vue) → Backend (NestJS)
Backend como Fuente de Verdad: Código de controllers NestJS

1. Resumen Ejecutivo
   Contexto Frontend Consume Backend Expone Estado Notas
   Auth /auth/_ /auth/_ ✅ SYNC Perfecto
   User/Account /users/me /users/_ ✅ SYNC Profile endpoint correcto
   Products /products/_ /products/_ ✅ SYNC Todos los endpoints alineados
   Cart /cart/_ /cart/_ ✅ SYNC Perfecto
   Orders /orders/_ /orders/_ ✅ SYNC Perfecto
   Payment /payments/_ /payments/_ ✅ SYNC Corregido (README actualizado)
   Inventory /inventory/:id/_ /inventory/:id/_ ✅ SYNC Corregido previamente
   Categories /categories/_ /categories/_ ✅ SYNC Corregido previamente
   Admin (Users, Products, Orders, Payments) /admin/_ ❌ NO EXISTE 🔴 CRÍTICO Frontend usa rutas obsoletas
   Admin (Dashboard) ❓ NO CONSUME /admin/dashboard 🟡 MINOR Dashboard no implementado en front
   Estado Global: 🟡 MAYORMENTE SINCRONIZADO con 1 problema crítico en Admin panel

2. Análisis Detallado por Contexto
   🟢 Auth Context
   Frontend (
   authService.ts
   ):

POST /auth/login ✅
POST /auth/register ✅
POST /auth/refresh ✅
POST /auth/logout ✅
GET /users/me ✅ (delegado a User context, correcto)
Backend (
AuthController
):

POST /auth/login ✅
POST /auth/register ✅
POST /auth/refresh ✅
POST /auth/logout ✅
GET /auth/me ✅
⚠️ Discrepancia Menor:

Frontend call profile vía /users/me (UserController)
Backend también tiene /auth/me (redundante pero OK)
Acción: No requiere cambio, ambos funcionan
🟢 Products Context
Frontend (
productsApi.ts
):

GET /products (con pagination) ✅
GET /products/:id ✅
GET /products/search?query= ✅
POST /products (save/upsert) ✅
PUT /products/:id/stock ✅
GET /products/low-stock ✅
POST /products/:id/restore ✅
DELETE /products/:id?hard=true ✅
Backend (
ProductsController
):

Todos coinciden perfectamente ✅
Upload image movido correctamente a /products/:id/upload-image
Estado: ✅ 100% SINCRONIZADO

🟢 Cart Context
Frontend (
cartApi.ts
):

GET /cart
POST /cart/items
PUT /cart/items/:productId
DELETE /cart/items/:productId
DELETE /cart
Backend (
CartController
):

Todos coinciden ✅
Estado: ✅ 100% SINCRONIZADO

🟢 Orders Context
Frontend (
ordersApi.ts
):

GET /orders
GET /orders/:id
POST /orders/from-cart
POST /orders (from items)
PATCH /orders/:id/cancel
PATCH /orders/:id/pay
PATCH /orders/:id/complete
Backend (
OrdersController
):

Todos coinciden ✅
Estado: ✅ 100% SINCRONIZADO

🟢 Payment Context
Frontend (
paymentService.ts
):

POST /payments/initiate ✅
POST /payments/:id/confirm ✅
Backend (
PaymentController
):

POST /payments/initiate ✅
POST /payments/:id/confirm ✅
POST /payments/:id/fail (no usado por front, OK)
GET /payments (list, no usado por front, OK)
GET /payments/:id (getById, no usado por front, OK)
Estado: ✅ SINCRONIZADO (frontend usa subset de endpoints, correcto)

🔴 Admin Panel - PROBLEMA CRÍTICO
Frontend (
adminApi.ts
) CONSUME:

// Users
GET /admin/users ❌ NO EXISTE EN BACKEND
GET /admin/users/:id ❌ NO EXISTE EN BACKEND  
PATCH /admin/users/:id/status ❌ NO EXISTE EN BACKEND
// Products
GET /admin/products ❌ NO EXISTE EN BACKEND
GET /admin/products/:id ❌ NO EXISTE EN BACKEND
PATCH /admin/products/:id ❌ NO EXISTE EN BACKEND
POST /admin/products/:id/upload-image ❌ NO EXISTE (movido a /products/:id/upload-image)
// Orders
GET /admin/orders ❌ NO EXISTE EN BACKEND
GET /admin/orders/:id ❌ NO EXISTE EN BACKEND
POST /admin/orders/:id/cancel ❌ NO EXISTE EN BACKEND
POST /admin/orders/:id/ship ❌ NO EXISTE EN BACKEND
POST /admin/orders/:id/complete ❌ NO EXISTE EN BACKEND
// Payments
GET /admin/payments ❌ NO EXISTE EN BACKEND
GET /admin/payments/:id ❌ NO EXISTE EN BACKEND
// Categories - CORRECTO ✅
GET /categories ✅ OK (usa controlador correcto)
POST /categories ✅ OK
// Inventory - CORRECTO ✅
GET /inventory/:productId ✅ OK (usa controlador correcto)
POST /inventory/:productId/increase ✅ OK
Backend (
AdminController
) EXPONE:

GET /admin/dashboard ✅ (Frontend NO lo consume aún)
❌ PROBLEMA CRÍTICO: El frontend intenta consumir endpoints /admin/users, /admin/products, /admin/orders, /admin/payments que fueron eliminados en la refactorización de limpieza del AdminController.

Acción Requerida: El frontend debe actualizarse para consumir endpoints de dominio directamente con guards de admin:

/admin/users/_ → /users/_ (con JWT admin)
/admin/products/_ → /products/_ (ya protegidos con @Roles('admin'))
/admin/orders/_ → /orders/_ (con lógica admin en front)
/admin/payments/_ → /payments/_ 3. Soluciones y Cambios Requeridos
🔴 URGENTE: Actualizar
adminApi.ts
// ❌ ANTES (OBSOLETO):
getUsers: () => axiosAdapter.get('/admin/users')
// ✅ AHORA (CORRECTO):
getUsers: () => axiosAdapter.get('/users') // Backend UserController tiene endpoint list de users con guard admin
// ❌ ANTES:
uploadProductImage: (id, file) => axiosAdapter.post(`/admin/products/${id}/upload-image`, formData)
// ✅ AHORA:
uploadProductImage: (id, file) => axiosAdapter.post(`/products/${id}/upload-image`, formData)
Endpoints a verificar en Backend que EXISTAN versiones con guard admin:

Necesito verificar si
UserController
,
ProductsController
,
OrdersController
,
PaymentController
tienen endpoints de "list all" protegidos con @Roles('admin'):

UserController: ¿Tiene GET /users (list all) con admin guard?
ProductsController: ¿Tiene GET /products accesible para admin para ver todos (incluidos deleted)?
OrdersController: ¿Tiene endpoint para admin ver todas las órdenes o solo del usuario?
PaymentController: Similar a Orders 4. Verificación de DTOs/Response Shapes
✅ Auth:
AuthResponse
del backend coincide con
AuthResponseRaw
del frontend
✅ Orders:
OrderResponseDTO
coincide (verificado previamente)
✅ Products: ProductDTO frontend mapea correctamente respuesta backend
✅ Cart: CartDTO alineado
✅ Payment: PaymentResponse validado con Zod schema en frontend 5. Guards & Roles - Reflexión en Frontend
Backend Guards:

JwtAuthGuard → Frontend: token en headers (✅ implementado en interceptor)
@Roles('admin') → Frontend: ¿Verifica rol antes de mostrar vistas admin?
Verificación Pendiente:

¿Frontend tiene guards de navegación que verifican rol admin antes de acceder a /admin/_ routes?
¿Frontend muestra/oculta opciones de admin basándose en rol del usuario? 6. Recomendaciones Finales
🔴 Críticas (Bloquean Funcionalidad)
Actualizar
adminApi.ts
: Cambiar todas las rutas /admin/_ (excepto dashboard) a sus controladores de dominio
Verificar Backend UserController: Confirmar que tiene endpoint admin para listar todos los usuarios
Implementar Dashboard Frontend: Consumir GET /admin/dashboard para métricas
🟡 Importantes (Mejoras)
Centralizar Admin Guards: Asegurar que todas las rutas admin en frontend verifiquen rol antes de renderizar
Añadir manejo de errores 403: Detectar "Forbidden" y redirigir si usuario no admin intenta acceder
Validación de Schemas: Extender uso de Zod como en paymentService a otros servicios
🟢 Opcionales (Futuro)
Generar tipos TypeScript: Usar herramienta como OpenAPI Generator para generar interfaces frontend desde Swagger backend
E2E Tests: Validar flujos completos frontend→backend (login→cart→order→payment)
Documentation Sync: Mantener README del frontend actualizado con endpoints consumidos 7. Estado Actual vs Esperado
Antes de esta Auditoría:

Backend tenía endpoints duplicados en /admin/\*
Frontend consumía esos duplicados
Refactorización de backend eliminó duplicados
Frontend quedó desactualizado ❌
Después de Correcciones:

Backend limpio, cada contexto expone sus endpoints ✅
Frontend debe actualizarse a rutas de dominio ⏳
Documentación sincronizada ✅ 8. Checklist de Acciones
Actualizar
adminApi.ts
: cambiar rutas /admin/users → /users, etc.
Verificar que UserController backend tiene GET /users con guard admin
Verificar que ProductsController tiene endpoint para admin ver productos eliminados
Implementar consumo de GET /admin/dashboard en frontend
Añadir validación de rol admin en guards de navegación Vue
Testing E2E de panel admin tras cambios
Actualizar README del frontend con arquitectura de consumo API
