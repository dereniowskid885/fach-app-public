export enum EPaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELED = "canceled",
  REFUNDED = "refunded",
}

export enum EPaymentIntentType {
  TICKET = "ticket",
}

export enum EPaymentIntentEvent {
  PAYMENT_SUCCEEDED = "payment_intent.succeeded",
  PAYMENT_FAILED = "payment_intent.payment_failed",
}
