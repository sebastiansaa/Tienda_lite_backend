# Payment Context

## Propósito

Gestionar procesamiento de pagos con integración a pasarelas externas (Stripe) y registro de transacciones.

## Endpoints

| Método | Ruta                    | Propósito                                 |
| ------ | ----------------------- | ----------------------------------------- |
| `POST` | `/payments/initiate`    | Crear Payment Intent de Stripe para orden |
| `POST` | `/payments/:id/confirm` | Confirmar pago tras tokenización exitosa  |
| `POST` | `/payments/:id/fail`    | Marcar pago como fallido                  |
| `GET`  | `/payments`             | Listar pagos del usuario autenticado      |
| `GET`  | `/payments/:id`         | Obtener detalles de pago por ID           |

## Guards/Seguridad

- **JwtAuthGuard**: Todos los endpoints requieren autenticación
- **Ownership validation**: Usuario solo puede ver pagos de sus propias órdenes
- **ValidationPipe**: Validación automática de DTOs

## Invariantes/Reglas Críticas

- **Idempotencia**: Múltiples intentos de pago con mismo parámetro retornan mismo resultado
- **Monto inmutable**: Monto del pago debe coincidir con total de la orden
- **Estados finales**: `SUCCEEDED` y `FAILED` son estados terminales, no modificables
- **Ownership estricto**: Solo el owner de la orden puede confirmar/fallar su pago

## Estados Relevantes

| Estado       | Descripción                            | Impacto Frontend/BC                             |
| ------------ | -------------------------------------- | ----------------------------------------------- |
| `PENDING`    | Payment creado, esperando confirmación | Muestra spinner de carga                        |
| `PROCESSING` | Pago en proceso por pasarela           | Bloquea UI, espera confirmación                 |
| `SUCCEEDED`  | Pago exitoso                           | Actualiza orden a PAID, redirige a confirmación |
| `FAILED`     | Pago rechazado                         | Muestra error, permite reintentar               |

## Config/Integración

### Variables de Entorno

- `STRIPE_SECRET_KEY`: API key de Stripe para backend
- `STRIPE_PUBLISHABLE_KEY`: Public key para frontend (opcional, puede estar en .env frontend)

### Dependencias Externas

- **Stripe SDK**: Procesamiento de pagos (`stripe` npm package)
- **Prisma**: Persistencia en PostgreSQL (tabla `Payment`)
- **Orders Context**: Actualiza estado de orden tras pago exitoso vía `ORDER_WRITE_REPOSITORY`

### Tokens DI Expuestos

- `PAYMENT_REPOSITORY`: Repositorio de pagos (usado por Admin context)
- `STRIPE_SERVICE`: Servicio de integración con Stripe (si existe adapter específico)

## Notas Arquitectónicas

- **Anti-Corruption Layer**: Adaptador de Stripe traduce respuestas externas a dominio interno
- **Retry logic**: Pagos fallidos permiten reintentos creando nuevo Payment Intent
- **Ownership**: Validación estricta de que usuario solo accede a sus propios pagos
