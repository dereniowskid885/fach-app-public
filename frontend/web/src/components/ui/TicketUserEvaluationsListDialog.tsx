import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { DataTable } from '../common/DataTable';
import {
  Evaluation,
  PatchTicketsByIdAcceptEvaluationApiArg,
  usePatchTicketsByIdAcceptEvaluationMutation
} from '@/api/accountApi';
import { getFormattedPriceAmount, getUserFullName } from '@/utils/shared';
import { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { getFormattedDate } from '@/utils/date';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketUserEvaluationsListDialog {
  open: boolean;
  closeDialog: () => void;
  ticketId?: string;
  ticketEvaluations?: Evaluation[];
}

export default function TicketUserEvaluationsListDialog({
  open,
  closeDialog,
  ticketId,
  ticketEvaluations = []
}: ITicketUserEvaluationsListDialog) {
  const t = useTranslations();

  const [selectedEvaluationRow, setSelectedEvaluationRow] = useState<RowSelectionState>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerEvaluationAccept, { isLoading, error }] =
    usePatchTicketsByIdAcceptEvaluationMutation();

  useErrorHandler(error, {
    setInlineError: message => setErrorMessage(message)
  });

  if (!ticketEvaluations) return;

  const isEvaluationSelected = Object.keys(selectedEvaluationRow).length > 0;

  const evaluationsTableData = ticketEvaluations?.map(evaluation => {
    const formattedDate = getFormattedDate(evaluation.dateOfResponse);
    const formattedAmount = getFormattedPriceAmount(evaluation.price?.amountInCents);

    return {
      specialistName: getUserFullName(evaluation.user, t('common.unknownUser')),
      specialistEmail: evaluation.user?.email,
      dateOfResponse: formattedDate,
      price: `${formattedAmount} ${evaluation.price?.currency}`,
      city: evaluation.user?.city,
      disabled: !evaluation.user
    };
  });

  const evaluationsTable = (
    <DataTable
      data={evaluationsTableData}
      selectableRows={true}
      oneSelectableRow={true}
      setSelectedRow={setSelectedEvaluationRow}
      columns={[
        {
          id: 'evaluation-list-specialist-name',
          accessorKey: 'specialistName',
          header: t('userRole.specialist')
        },
        {
          id: 'evaluation-list-specialist-email',
          accessorKey: 'specialistEmail',
          header: t('authForm.email')
        },
        {
          id: 'evaluation-list-date-of-response',
          accessorKey: 'dateOfResponse',
          header: t('evaluation.dateOfResponse')
        },
        {
          id: 'evaluation-list-price',
          accessorKey: 'price',
          header: t('evaluation.price')
        },
        {
          id: 'evaluation-list-city',
          accessorKey: 'city',
          header: t('evaluation.city')
        }
      ]}
    />
  );

  const getSelectedEvaluation = () => {
    const selectedRows = Object.keys(selectedEvaluationRow);

    if (selectedRows.length !== 1) return;

    const rowIndex = selectedRows[0];

    if (isNaN(Number(rowIndex))) return;

    return ticketEvaluations[Number(rowIndex)];
  };

  const submitHandler = async () => {
    const selectedEvaluation = getSelectedEvaluation();

    if (!selectedEvaluation?._id || !ticketId) return;

    const payload: PatchTicketsByIdAcceptEvaluationApiArg = {
      id: ticketId,
      body: {
        evaluationId: selectedEvaluation?._id
      }
    };

    const { error } = await triggerEvaluationAccept(payload);
    if (error) return;

    closeDialog();
    toast.success(t('evaluationListDialog.toastTitle'));
  };

  return (
    <DialogComponent
      open={open}
      contentClass="max-lg:max-w-none lg:max-w-[70%]"
      title={t('evaluationListDialog.title')}
      content={evaluationsTable}
      cancelButtonText={t('common.back')}
      cancelButtonHandler={closeDialog}
      confirmButtonText={t('evaluationListDialog.confirmButtonText')}
      confirmButtonHandler={submitHandler}
      confirmButtonDisabled={!isEvaluationSelected}
      isLoadingConfirmButton={isLoading}
      errorMessage={errorMessage}
    />
  );
}
