import React, { useState } from 'react';
import { Ticket } from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import DialogComponent from '@/components/ui/DialogComponent';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { ETicketStatus } from 'shared-types';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { CheckCircle2, CheckSquare } from 'lucide-react';
import Typography from '@/components/ui/Typography';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from '@/components/shadcn/field';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import { ETicketResolutionType } from '@/enums/ticket';

export interface ITicketUserSolutionReviewDialog {
  open: boolean;
  ticket: Ticket;
  closeDialog: () => void;
}

export default function TicketUserSolutionReviewDialog({
  open,
  ticket,
  closeDialog
}: ITicketUserSolutionReviewDialog) {
  const t = useTranslations();

  const [ticketResolutionType, setTicketResolutionType] = useState<ETicketResolutionType>(
    ETicketResolutionType.RESOLVED
  );
  const ticketResolutionObj = {
    [ETicketResolutionType.RESOLVED]: {
      status: ETicketStatus.COMPLETED,
      toastMessage: t('ticketDetailsDialog.toastTitle.solutionAccept')
    },
    [ETicketResolutionType.REPORT_ISSUE]: {
      status: ETicketStatus.MODERATOR_INVESTIGATION,
      toastMessage: t('ticketDetailsDialog.toastTitle.moderatorInvestigation')
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const [triggerUpdateTicket, { isLoading: isLoadingTicketUpdate, error: errorTicketUpdate }] =
    enhancedAccountApi.endpoints.patchTicketsById.useMutation();

  useErrorHandler(errorTicketUpdate, {
    setInlineError: message => setErrorMessage(message)
  });

  const updateTicketHandler = async () => {
    if (!ticket._id) return;

    const { error } = await triggerUpdateTicket({
      id: ticket._id,
      body: {
        status: ticketResolutionObj[ticketResolutionType].status
      }
    });

    if (error) return;

    closeDialog();
    setErrorMessage('');
    setTicketResolutionType(ETicketResolutionType.RESOLVED);
    toast.success(ticketResolutionObj[ticketResolutionType].toastMessage);
  };

  const content = (
    <RadioGroup defaultValue={ETicketResolutionType.RESOLVED}>
      <FieldLabel
        htmlFor={ETicketResolutionType.RESOLVED}
        className="cursor-pointer bg-lime-50"
        onClick={() => setTicketResolutionType(ETicketResolutionType.RESOLVED)}
      >
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>
              <CheckSquare className="text-lime-600" />

              <Typography variant="muted" className="text-lime-600">
                {t('ticketSolutionReviewDialog.resolvedTitle')}
              </Typography>
            </FieldTitle>

            <FieldDescription className="text-lime-600">
              {t('ticketSolutionReviewDialog.resolvedDescription')}
            </FieldDescription>
          </FieldContent>

          <RadioGroupItem
            value={ETicketResolutionType.RESOLVED}
            id={ETicketResolutionType.RESOLVED}
          />
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor={ETicketResolutionType.REPORT_ISSUE}
        className="cursor-pointer bg-orange-50"
        onClick={() => setTicketResolutionType(ETicketResolutionType.REPORT_ISSUE)}
      >
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>
              <CheckSquare className="text-orange-600" />

              <Typography variant="muted" className="text-orange-600">
                {t('ticketSolutionReviewDialog.reportIssueTitle')}
              </Typography>
            </FieldTitle>

            <FieldDescription className="text-orange-600">
              {t('ticketSolutionReviewDialog.reportIssueDescription')}
            </FieldDescription>
          </FieldContent>

          <RadioGroupItem
            value={ETicketResolutionType.REPORT_ISSUE}
            id={ETicketResolutionType.REPORT_ISSUE}
          />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );

  return (
    <DialogComponent
      open={open}
      headerContent={<CheckCircle2 size={24} />}
      title={t('ticketSolutionReviewDialog.title')}
      content={content}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={updateTicketHandler}
      isLoadingConfirmButton={isLoadingTicketUpdate}
      errorMessage={errorMessage ? errorMessage : ''}
    />
  );
}
