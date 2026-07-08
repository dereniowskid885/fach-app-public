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
  getPriceColumn,
  getDateOfResponseColumn,
  getSpecialistColumn,
  getStatusColumn,
  getTicketColumn,
  getResponseTimeColumn
} from '@/utils/dataTable';
import { EUserRole } from 'shared-types';

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

export const getAvailableTicketsColumns = (t: TFunction, currentLocale: string) => [
  getTicketColumn(t),
  getCityColumn(t),
  getCreatedAtColumn(t, currentLocale),
  getConversationColumn(t),
  getActionColumn(EUserRole.SPECIALIST),
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

// @/src/components/ui/TicketUserEvaluationsListDialog.tsx

export const getEvaluationsListDialogColumns = (t: TFunction, currentLocale: string) => [
  getSpecialistColumn(t),
  getCityColumn(t),
  getPriceColumn(t),
  getResponseTimeColumn(t),
  getDateOfResponseColumn(t, currentLocale)
];
