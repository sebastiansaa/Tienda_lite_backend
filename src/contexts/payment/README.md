Payment

- Proposito: gestionar pagos asociados a ordenes, incluyendo iniciacion, confirmacion y fallo.
- Responsabilidades: iniciar pago con provider, validar estado de orden, registrar estado y datos externos, listar pagos de usuario.

Capas
- Domain: `PaymentEntity`; VOs `PaymentId`, `OrderId`, `UserId`, `Amount`, `PaymentStatus`, `ClientSecret`, `ExternalPaymentId`, timestamps; errores `PaymentAlreadyProcessed`, `InvalidPaymentState`.
- Application: usecases InitiatePayment, ConfirmPayment, FailPayment, GetPaymentById, ListPaymentsForUser; puertos `PaymentRepositoryPort`, `PaymentProviderPort`, `OrderReadOnlyPort`.
- Infrastructure: `PaymentPrismaRepository` (persistencia), `PaymentProviderFakeAdapter` (simula PSP), `PaymentOrderReadAdapter` (lee ordenes via puerto en Orders).
- API: `PaymentController`, DTOs, `PaymentApiMapper`; protegido con JwtAuthGuard.

Invariantes
- Estados transicionan Pending -> Succeeded/Failed; no se puede confirmar dos veces; monto se guarda como Decimal.

Puertos expuestos
- `PAYMENT_REPOSITORY`, `PAYMENT_PROVIDER`, `PAYMENT_ORDER_READONLY`.

Adaptadores implementados
- Prisma repo; provider fake; order-read adapter consulta ordenes via puerto expuesto por Orders.

Endpoints
- POST /payments/initiate, POST /payments/:id/confirm, POST /payments/:id/fail, GET /payments, GET /payments/:id.

Integraciones
- Consume Order read-model para validar propiedad y estado; depende de Auth para usuario; puede ser consultado por Admin via su propio adaptador Prisma.

Diagrama textual
- HTTP -> PaymentController -> DTO -> Mapper -> UseCase -> (PaymentRepo|Provider|OrderRead ports) -> Adapters -> DB/PSP -> Mapper -> DTO.

Notas de diseño
- Provider intercambiable via puerto; fake adapter facilita pruebas.

Razon de aislamiento
- No expone ni depende de dominio Order; solo consume puerto read-only y mantiene su propio lifecycle de pago.
