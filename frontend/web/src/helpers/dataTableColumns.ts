import { TFunction } from '@/types/i18n';
import {
  getActionColumn,
  getAssigneeColumn,
  getCategoryColumn,
  getCityColumn,
  getConversationColumn,
  getCreatedAtColumn,
  getCreatedByColumn,
  getDropdownMenuColumn,
  getStatusColumn,
  getTicketColumn
} from '@/utils/dataTable';
import { EUserRole } from '@shared/enums/role';

/**
 * Column definition helpers for ticket-related data tables.
 * Each function composes shared column definitions from `@/utils/dataTable`
 * into table-specific configurations.
 */

export const getMyTicketsColumns = (
  t: TFunction,
  currentLocale: string,
  role: EUserRole | string
) => [
  getTicketColumn(t),
  getStatusColumn(t),
  role !== EUserRole.SPECIALIST ? getCategoryColumn(t) : getCityColumn(t),
  getCreatedAtColumn(t, currentLocale),
  getAssigneeColumn(t),
  getConversationColumn(t),
  getActionColumn(role),
  getDropdownMenuColumn()
];

export const getAvailableTicketsColumns = (t: TFunction, currentLocale: string, userId: string) => [
  getTicketColumn(t),
  getCityColumn(t),
  getCreatedAtColumn(t, currentLocale),
  getCreatedByColumn(t),
  getConversationColumn(t),
  getActionColumn(EUserRole.SPECIALIST, userId),
  getDropdownMenuColumn()
];

export const getAllTicketsColumns = (t: TFunction, currentLocale: string) => [
  getTicketColumn(t),
  getStatusColumn(t),
  getCategoryColumn(t),
  getCityColumn(t),
  getCreatedAtColumn(t, currentLocale),
  getCreatedByColumn(t),
  getAssigneeColumn(t),
  getConversationColumn(t),
  getDropdownMenuColumn()
];
