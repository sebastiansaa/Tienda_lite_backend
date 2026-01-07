# Payment Context

Responsable de la integración con pasarelas de pago virtuales y el seguimiento de transacciones vinculadas a las órdenes del sistema.

## Estructura de Carpetas

- `api/`: Controllers para inicio y confirmación de pagos por el usuario.
- `app/`: Casos de uso (iniciar pago, confirmar éxito, registrar fallo).
- `domain/`: Entidades de pago y gestión de estados de transacción.
- `infra/`: Adaptadores para pasarelas de pago y repositorios Prisma.

## Casos de Uso y Endpoints

- `POST /payments/initiate`: Inicia una intención de pago para una orden.
- `POST /payments/:id/confirm`: Confirma la recepción del pago.
- `GET /payments`: Historial de transacciones del usuario autenticado.
- `Admin Transacciones`: Auditoría global de pagos (vía AdminContext).

## Ejemplo de Uso

```typescript
// Iniciar pago de una orden
const payment = await initiateUseCase.execute({
  orderId: 'O-456',
  method: 'CREDIT_CARD',
});
console.log(`Pago pendiente: ${payment.id}`);
```

## Notas de Integración

- **Seguridad**: Uso opcional de Webhooks.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Validación**: Verifica que la orden esté en estado PENDING.
