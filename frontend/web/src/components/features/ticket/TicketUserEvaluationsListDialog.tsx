import React, { useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { DataTable } from '@/components/ui/DataTable';
import {
  Evaluation,
  PatchTicketsByIdAcceptEvaluationApiArg,
  usePatchTicketsByIdAcceptEvaluationMutation
} from '@/services/api/generated/accountApi';
import { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { getEvaluationsListDialogColumns } from '@/helpers/dataTable';
import { ChartColumn } from 'lucide-react';

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
  const currentLocale = useLocale();

  const [selectedEvaluationRow, setSelectedEvaluationRow] = useState<RowSelectionState>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerEvaluationAccept, { isLoading, error }] =
    usePatchTicketsByIdAcceptEvaluationMutation();

  useErrorHandler(error, {
    setInlineError: message => setErrorMessage(message)
  });

  if (!ticketEvaluations) return;

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

  const isEvaluationSelected = Object.keys(selectedEvaluationRow).length > 0;
  const tableColumnsData = getEvaluationsListDialogColumns(t, currentLocale);

  return (
    <DialogComponent
      open={open}
      contentClass="max-lg:max-w-none lg:max-w-[70%]"
      size="none"
      headerContent={<ChartColumn size={24} />}
      title={t('evaluationListDialog.title')}
      content={
        <DataTable
          data={ticketEvaluations}
          selectableRows={true}
          oneSelectableRow={true}
          setSelectedRow={setSelectedEvaluationRow}
          columns={tableColumnsData}
          className="bg-card"
        />
      }
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
