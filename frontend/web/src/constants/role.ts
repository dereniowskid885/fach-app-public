import { EUserRole } from 'shared-types';

export const roleObj = {
  [EUserRole.ADMIN]: {
    name: 'admin',
    textClass: 'text-orange-600',
    wrapperClass: 'bg-orange-50 border-orange-200'
  },
  [EUserRole.USER]: {
    name: 'user',
    textClass: 'text-emerald-600',
    wrapperClass: 'bg-emerald-50 border-emerald-200'
  },
  [EUserRole.SPECIALIST]: {
    name: 'specialist',
    textClass: 'text-blue-600',
    wrapperClass: 'border-blue-200 bg-blue-50'
  }
};
