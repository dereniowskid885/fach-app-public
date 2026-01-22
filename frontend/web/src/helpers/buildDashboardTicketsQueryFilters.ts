import { EUserRole } from '@/constants/userRole';

export const buildDashboardTicketsQueryFilters = (role: string, userId: string) => {
  const filters: Record<string, string> = {};

  if (!role || !userId) return;

  const isUser = role === EUserRole.USER;
  const isSpecialist = role === EUserRole.SPECIALIST;

  if (isUser) {
    filters.createdBy = userId;
  }

  if (isSpecialist) {
    filters.assignee = userId;
  }

  return filters;
};
