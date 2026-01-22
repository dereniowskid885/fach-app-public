import React, { useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { DataTable } from '../common/DataTable';
import {
  Evaluation,
  PatchTicketsByIdAcceptEvaluationApiArg,
  usePatchTicketsByIdAcceptEvaluationMutation
} from '@/api/accountApi';
import { getFormattedDate, getFormattedPriceAmount, parseQueryError } from '@/lib/helpers';
import { RowSelectionState } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
          header: 'Fachowiec'
        },
        {
          accessorKey: 'specialistEmail',
          header: 'Email'
        },
        {
          accessorKey: 'dateOfResponse',
          header: 'Czas odpowiedzi'
        },
        {
          accessorKey: 'price',
          header: 'Cena'
        },
        {
          accessorKey: 'city',
          header: 'Miasto'
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
      toast({
        title: 'Wycena sprawy została zaakceptowana',
        duration: 3000
      });
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
  };

  return (
    <DialogComponent
      open={open}
      contentClass="max-lg:max-w-none lg:max-w-[70%]"
      title="Aktualne wyceny sprawy"
      content={evaluationsTable}
      cancelButtonText="Wstecz"
      cancelButtonHandler={closeDialog}
      confirmButtonText="Zaakceptuj wycenę"
      confirmButtonHandler={submitHandler}
      confirmButtonDisabled={!isEvaluationSelected}
      isLoadingConfirmButton={isLoading}
      errorMessage={errorMessage}
    />
  );
};
