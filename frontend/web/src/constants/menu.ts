import {
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Settings,
  BriefcaseBusiness,
  ChartColumn,
  ClipboardCheck
} from 'lucide-react';
import { AVAILABLE_TICKETS_PATH, HOME_PATH, ROUTES, TICKETS_PATH } from './routes';
import { EUserRole } from '@shared/constants/enums';

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
    href: '#',
    path: {
      en: '',
      pl: ''
    }
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

const baseMenuItems = [...commonMenuItems, ...otherMenuItems];
const specialistMenuItems = [
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
    href: '#',
    path: {
      en: '',
      pl: ''
    }
  },
  ...otherMenuItems
];

export const menuItemsObj = {
  [EUserRole.USER]: baseMenuItems,
  [EUserRole.ADMIN]: baseMenuItems,
  [EUserRole.SPECIALIST]: specialistMenuItems
};
