import React, { useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { Ticket } from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { allowedTicketTransitions, ETicketStatus } from 'shared-types';
import { ticketStatusObj } from '@/constants/ticketStatus';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from '@/components/shadcn/field';
import TicketStatusIcon from './TicketStatusIcon';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import { getTicketUpdateErrorDescription } from '@/helpers/ticket';
import { ClipboardList } from 'lucide-react';

export interface ITicketAdminStatusChangeDialog {
  open: boolean;
  closeDialog: () => void;
  ticket: Ticket;
}

export default function TicketAdminStatusChangeDialog({
  open,
  closeDialog,
  ticket
}: ITicketAdminStatusChangeDialog) {
  const ticketStatus = ticket.status as ETicketStatus;

  const t = useTranslations();

  const [chosenTicketStatus, setChosenTicketStatus] = useState<ETicketStatus | null>(null);

  const [triggerUpdateTicket, { isLoading: isLoadingTicketUpdate, error: errorTicketUpdate }] =
    enhancedAccountApi.endpoints.patchTicketsById.useMutation();

  useErrorHandler(errorTicketUpdate, {
    toastDescription: getTicketUpdateErrorDescription(ticket, chosenTicketStatus, t)
  });

  const updateTicketHandler = async () => {
    if (!ticket._id || !chosenTicketStatus) return;

    const result = await triggerUpdateTicket({
      id: ticket._id,
      body: {
        status: chosenTicketStatus
      }
    });

    const { error } = result;
    if (error) return;

    closeDialog();
    toast.success(t('ticketAdminStatusChangeDialog.toastTitle'));
  };

  const content = (
    <RadioGroup defaultValue={ticket.status}>
      {allowedTicketTransitions[ticketStatus]?.admin?.map(status => {
        return (
          <FieldLabel
            key={status}
            htmlFor={status}
            className={`cursor-pointer ${ticketStatusObj[status].className}`}
            onClick={() => setChosenTicketStatus(status)}
          >
            <Field orientation="horizontal">
              <FieldContent className="space-y-2">
                <FieldTitle>
                  <TicketStatusIcon status={status} showStatusText={true} />
                </FieldTitle>

                <FieldDescription className={ticketStatusObj[status].className}>
                  {t(`ticketAdminStatusChangeDialog.statusChangeDescription.${status}`)}
                </FieldDescription>
              </FieldContent>

              <RadioGroupItem value={status} id={status} />
            </Field>
          </FieldLabel>
        );
      })}
    </RadioGroup>
  );

  return (
    <DialogComponent
      open={open}
      content={content}
      contentClass="max-w-xl"
      size="none"
      headerContent={<ClipboardList size={24} />}
      title={t('ticketAdminStatusChangeDialog.title')}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={updateTicketHandler}
      isLoadingConfirmButton={isLoadingTicketUpdate}
    />
  );
}
