import { ETicketCategory, ETicketStatus, ITicket } from '@/constants/ticket';

export const tickets: ITicket[] = [
  {
    id: '#4321',
    category: ETicketCategory.AUTOMOTIVE,
    assignee: 'Andrzej Formove',
    status: ETicketStatus.PRICE_EVALUATION,
    price: '-',
    title: 'Pomoc w wymianie oleju w silniku BMW M50B25',
    description:
      'Proszę o pomoc w przeprowadzeniu wymiany oleju w moim silniku BMW M50B25. Potrzebuję informacji na temat bananów.'
  },
  {
    id: '#4322',
    category: ETicketCategory.ELECTRONICS,
    assignee: 'Marta Kowalska',
    status: ETicketStatus.PENDING_PAYMENT,
    price: '-',
    title: 'Naprawa ekranu w laptopie Dell XPS',
    description:
      'Ekran w moim laptopie Dell XPS 15 wyświetla pionowe linie. Potrzebuję wyceny naprawy matrycy.'
  },
  {
    id: '#4323',
    category: ETicketCategory.HOME,
    assignee: 'Piotr Nowicki',
    status: ETicketStatus.SOLUTION_USER_APPROVAL,
    price: '15,00 zł',
    title: 'Wymiana zamka w drzwiach wejściowych',
    description: 'Potrzebuję wyceny wymiany zamka w drzwiach wejściowych. Zamek jest typu Gerda.'
  },
  {
    id: '#4324',
    category: ETicketCategory.AUTOMOTIVE,
    assignee: 'Tomasz Wiśniewski',
    status: ETicketStatus.PRICE_USER_ACCEPTATION,
    price: '10,00 zł',
    title: 'Diagnostyka klimatyzacji Audi A4 B8',
    description:
      'Klimatyzacja w moim Audi A4 B8 2012 przestała chłodzić. Proszę o wycenę diagnostyki i ewentualnej naprawy.'
  }
];
