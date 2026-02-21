import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { DataTable } from '../common/DataTable';
import {
  Evaluation,
  PatchTicketsByIdAcceptEvaluationApiArg,
  usePatchTicketsByIdAcceptEvaluationMutation
} from '@/api/accountApi';
import { getFormattedDate, getFormattedPriceAmount, parseQueryError } from '@/lib/utils';
import { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export interface IEvaluationsListDialog {
  open: boolean;
  refetchTickets: () => void;
  closeDialog: () => void;
  ticketId?: string;
  ticketEvaluations?: Evaluation[];
}

export const EvaluationsListDialog = ({
  open,
  refetchTickets,
  closeDialog,
  ticketId,
  ticketEvaluations = []
}: IEvaluationsListDialog) => {
  const t = useTranslations();

  const [selectedEvaluationRow, setSelectedEvaluationRow] = useState<RowSelectionState>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerEvaluationAccept, { isLoading }] = usePatchTicketsByIdAcceptEvaluationMutation();

  if (!ticketEvaluations) return;

  const isEvaluationSelected = Object.keys(selectedEvaluationRow).length > 0;

  const evaluationsTableData = ticketEvaluations?.map(evaluation => {
    const formattedDate = getFormattedDate(evaluation.dateOfResponse);
    const formattedAmount = getFormattedPriceAmount(evaluation.price?.value);

    return {
      specialistName: `${evaluation.user?.name} ${evaluation.user?.surname}`,
      specialistEmail: evaluation.user?.email,
      dateOfResponse: formattedDate,
      price: `${formattedAmount} ${evaluation.price?.currency}`,
      city: evaluation.user?.city
    };
  });

  const evaluationsTable = (
    <DataTable
      data={evaluationsTableData!}
      selectableRows={true}
      oneSelectableRow={true}
      setSelectedRow={setSelectedEvaluationRow}
      columns={[
        {
          accessorKey: 'specialistName',
          header: t('userRole.specialist')
        },
        {
          accessorKey: 'specialistEmail',
          header: t('authForm.email')
        },
        {
          accessorKey: 'dateOfResponse',
          header: t('evaluation.dateOfResponse')
        },
        {
          accessorKey: 'price',
          header: t('evaluation.price')
        },
        {
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

    const result = await triggerEvaluationAccept(payload);
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      closeDialog();
      refetchTickets();
      toast.success(t('evaluationListDialog.toastTitle'));
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
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
};
