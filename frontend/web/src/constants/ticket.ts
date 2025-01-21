export enum ETicketCategory {
  AUTOMOTIVE = 'Mechanika pojazdowa',
  ELECTRONICS = 'Elektronika',
  HOME = 'Dom'
}

export const ticketCategories = Object.values(ETicketCategory);

export enum ETicketStatus {
  PRICE_EVALUATION = 'Wycena',
  PRICE_USER_ACCEPTATION = 'Akceptacja wyceny',
  PENDING_PAYMENT = 'Oczekiwanie na płatność',
  IN_PROGRESS = 'W trakcie',
  SOLUTION_USER_APPROVAL = 'Akceptacja rozwiązania',
  MODERATOR_INVESTIGATION = 'Badanie przez moderatora',
  COMPLETED = 'Ukończony'
}

export interface ITicket {
  id: string;
  category: ETicketCategory;
  status: ETicketStatus;
  assignee: string;
  price: string;
  title: string;
  description: string;
}
