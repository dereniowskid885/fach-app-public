export enum ETicketStatus {
  AWAITING_EVALUATION = "awaiting_evaluation",
  AWAITING_PAYMENT = "awaiting_payment",
  IN_PROGRESS = "in_progress",
  SOLUTION_REVIEW = "solution_review",
  MODERATOR_INVESTIGATION = "moderator_investigation",
  COMPLETED = "completed",
  CANCELLED = "canceled",
}

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

export enum EUserRole {
  USER = "user",
  SPECIALIST = "specialist",
  ADMIN = "admin",
}

export enum ESupportedCurrency {
  PLN = "PLN",
}

export enum ESupportedLanguages {
  PL = "pl",
  EN = "en",
}

export enum EEnvironmentType {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum EThemeType {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}
