import { EUserRole } from 'shared-types';

export const ticketMessagesMock = [
  {
    id: '1',
    author: {
      fullName: 'Anna Kowalski',
      role: EUserRole.USER
    },
    content:
      'Hello, I am experiencing an issue with the payment gateway. Transactions are failing intermittently, and users are unable to complete their purchases. This started happening around 3 hours ago.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toDateString() // 3 hours ago
  },
  {
    id: '2',
    author: {
      fullName: 'Marek Nowak',
      role: EUserRole.SPECIALIST
    },
    content:
      'Thank you for reporting this. I have picked up the ticket and started investigating. Could you provide the transaction IDs of the failed payments so I can trace them in our logs?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toDateString() // 2.5 hours ago
  },
  {
    id: '3',
    author: {
      fullName: 'Anna Kowalski',
      role: EUserRole.USER
    },
    content:
      'Sure, here are a few transaction IDs: TXN-998821, TXN-998834, TXN-998901. All of them were attempted between 10:00 and 11:30 AM today. Let me know if you need anything else.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toDateString() // 2 hours ago
  },
  {
    id: '4',
    author: {
      fullName: 'Marek Nowak',
      role: EUserRole.SPECIALIST
    },
    content:
      "I've reviewed the logs and identified the root cause. The issue is related to the increased timeout threshold in our CDN configuration. I'm working on a fix and will deploy it to staging for testing.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toDateString() // 30 minutes ago
  }
];
