Payment

- Proposito: gestionar pagos asociados a ordenes, incluyendo iniciacion, confirmacion y fallo. Puede crear la orden PENDING si no viene `orderId` y admite `paymentMethodToken`/`currency` desde el front.
- Responsabilidades: iniciar pago con provider, validar estado/monto de orden, registrar estado y datos externos, listar pagos de usuario.

Capas
- Domain: `PaymentEntity`; VOs `PaymentId`, `OrderId`, `UserId`, `Amount`, `PaymentStatus`, `ClientSecret`, `ExternalPaymentId`, timestamps; errores `PaymentAlreadyProcessed`, `InvalidPaymentState`.
- Application: usecases InitiatePayment, ConfirmPayment, FailPayment, GetPaymentById, ListPaymentsForUser; puertos `IPaymentReadRepository`, `IPaymentWriteRepository`, `PaymentProviderPort`, `OrderReadOnlyPort`, `OrderWritePort` (crea orden checkout cuando falta `orderId`).
- Infrastructure: repos separados `PaymentPrismaReadRepository` y `PaymentPrismaWriteRepository`; `PaymentProviderFakeAdapter` (simula PSP), `PaymentOrderReadAdapter` (lee ordenes via puerto en Orders), `PaymentOrderWriteAdapter` (crea orden PENDING para checkout directo).
- API: `PaymentController`, DTOs, `PaymentApiMapper`; protegido con JwtAuthGuard y `ValidationPipe` con whitelist/transform.

Invariantes
- Estados transicionan Pending -> Succeeded/Failed; no se puede confirmar dos veces; monto se guarda como Decimal.

Puertos expuestos
- `PAYMENT_READ_REPOSITORY`, `PAYMENT_WRITE_REPOSITORY`, `PAYMENT_PROVIDER`, `PAYMENT_ORDER_READONLY`, `PAYMENT_ORDER_WRITE`.

Adaptadores implementados
- Prisma repo; provider fake; order-read adapter consulta ordenes via puerto expuesto por Orders; order-write adapter crea orden PENDING para checkout directo.

Endpoints
- POST /payments/initiate (body: { orderId?, amount, currency?, paymentMethodToken?, items? }) crea Payment, genera clientSecret/externalPaymentId y devuelve DTO.
- POST /payments/:id/confirm (body: { paymentMethodToken? }) confirma con provider y marca Succeeded/Failed.
- POST /payments/:id/fail, GET /payments, GET /payments/:id.

Integraciones
- Consume Order read-model para validar propiedad y estado; puede crear orden PENDING via puerto write cuando checkout viene solo con items; depende de Auth para usuario; puede ser consultado por Admin via su propio adaptador Prisma.

Diagrama textual
- HTTP -> PaymentController -> DTO -> Mapper -> UseCase -> (PaymentRepo|Provider|OrderRead|OrderWrite ports) -> Adapters -> DB/PSP -> Mapper -> DTO.

Notas de diseño
- Provider intercambiable via puerto; fake adapter facilita pruebas.

Razon de aislamiento
- No expone ni depende de dominio Order; solo consume puerto read-only y mantiene su propio lifecycle de pago.
