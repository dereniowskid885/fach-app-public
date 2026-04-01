import {
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Settings,
  BriefcaseBusiness,
  ChartColumn,
  ClipboardCheck
} from 'lucide-react';
import {
  ALL_TICKETS_PATH,
  AVAILABLE_TICKETS_PATH,
  COMPLETED_TICKETS_PATH,
  EVALUATIONS_PATH,
  HOME_PATH,
  ROUTES,
  TICKETS_PATH
} from './routes';
import { EUserRole } from 'shared-types';

const commonMenuItems = [
  {
    id: 'dashboard',
    translationKey: 'pages.dashboard',
    icon: LayoutDashboard,
    href: HOME_PATH,
    path: ROUTES[HOME_PATH]
  },
  {
    id: 'tickets',
    translationKey: 'pages.tickets',
    icon: ClipboardList,
    href: TICKETS_PATH,
    path: ROUTES[TICKETS_PATH]
  },
  {
    id: 'completed-tickets',
    translationKey: 'pages.completedTickets',
    icon: ClipboardCheck,
    href: COMPLETED_TICKETS_PATH,
    path: ROUTES[COMPLETED_TICKETS_PATH]
  }
];

const otherMenuItems = [
  {
    id: 'inbox',
    translationKey: 'pages.inbox',
    icon: MessageSquare,
    href: '#',
    path: {
      en: '',
      pl: ''
    }
  },
  {
    id: 'settings',
    translationKey: 'pages.settings',
    icon: Settings,
    href: '#',
    path: {
      en: '',
      pl: ''
    }
  }
];

export const menuItemsObj = {
  [EUserRole.USER]: [...commonMenuItems, ...otherMenuItems],
  [EUserRole.ADMIN]: [
    {
      id: 'dashboard',
      translationKey: 'pages.dashboard',
      icon: LayoutDashboard,
      href: HOME_PATH,
      path: ROUTES[HOME_PATH]
    },
    {
      id: 'all-tickets',
      translationKey: 'pages.allTickets',
      icon: ClipboardList,
      href: ALL_TICKETS_PATH,
      path: ROUTES[ALL_TICKETS_PATH]
    },
    ...otherMenuItems
  ],
  [EUserRole.SPECIALIST]: [
    ...commonMenuItems,
    {
      id: 'available-tickets',
      translationKey: 'pages.availableTickets',
      icon: BriefcaseBusiness,
      href: AVAILABLE_TICKETS_PATH,
      path: ROUTES[AVAILABLE_TICKETS_PATH]
    },
    {
      id: 'evaluations',
      translationKey: 'pages.evaluations',
      icon: ChartColumn,
      href: EVALUATIONS_PATH,
      path: ROUTES[EVALUATIONS_PATH]
    },
    ...otherMenuItems
  ]
};
