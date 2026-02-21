import { ClipboardList, LayoutDashboard, MessageSquare, Settings } from 'lucide-react';
import { HOME_PATH, ROUTES, TICKETS_PATH } from './routes';

export const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, href: HOME_PATH, path: ROUTES[HOME_PATH] },
  { id: 'tickets', icon: ClipboardList, href: TICKETS_PATH, path: ROUTES[TICKETS_PATH] },
  { id: 'inbox', icon: MessageSquare, href: '#' },
  { id: 'settings', icon: Settings, href: '#' }
];
