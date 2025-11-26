export enum ETicketStatus {
  PRICE_EVALUATION = "Wycena",
  PRICE_USER_ACCEPTATION = "Akceptacja wyceny",
  PENDING_PAYMENT = "Oczekiwanie na płatność",
  IN_PROGRESS = "W trakcie",
  SOLUTION_USER_APPROVAL = "Akceptacja rozwiązania",
  MODERATOR_INVESTIGATION = "Badanie przez moderatora",
  COMPLETED = "Ukończony",
}

export enum EUserRole {
  USER = "user",
  SPECIALIST = "specialist",
  ADMIN = "admin",
}

export enum ESupportedCurrency {
  PLN = "PLN",
}

export enum EEnvironmentType {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}
