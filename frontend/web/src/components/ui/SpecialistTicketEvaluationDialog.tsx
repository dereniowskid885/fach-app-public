import React, { useEffect, useRef, useState } from 'react';
import DialogComponent from '@/components/common/DialogComponent';
import { Label } from '@/components/shadcn/label';
import { TimePickerInput } from '../common/TimePicker';
import { Typography } from '../common/Typography';
import { Slider } from '../shadcn/slider';
import { EActionType, ETimePickerType } from '@/constants/enums';
import PriceInput from '../common/PriceInput';
import { ESupportedCurrency } from '@/constants/supportedCurrency';
import {
  usePatchTicketsByIdEvaluationMutation,
  accountApi,
  Ticket,
  usePatchTicketsByIdEditEvaluationMutation,
  Evaluation
} from '@/api/accountApi';
import { getFormattedPriceAmount, parseQueryError } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { getSpecialistPendingTicketStatusesParam } from '@/helpers/getSpecialistPendingTicketStatusesParam';

export interface ISpecialistTicketEvaluationDialog {
  open: boolean;
  mode: EActionType;
  ticket: Ticket;
  userEvaluation?: Evaluation;
  closeDialog: () => void;
}

export default function SpecialistTicketEvaluationDialog({
  open,
  mode,
  userEvaluation,
  ticket,
  closeDialog
}: ISpecialistTicketEvaluationDialog) {
  const t = {
    [EActionType.CREATION]: {
      dialogTitle: 'Wycena sprawy',
      toastMessage: 'Twoja wycena została wysłana do autora'
    },
    [EActionType.EDIT]: {
      dialogTitle: 'Edycja wyceny',
      toastMessage: 'Wycena została zaktualizowana'
    }
  };
  const maxMinutes = 1440; // 1 day

  const [priceInCents, setPriceInCents] = useState<number>(userEvaluation?.price?.value ?? 0);
  const [minutes, setMinutes] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const daysRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const [triggerCreate, { isLoading: isLoadingCreate }] = usePatchTicketsByIdEvaluationMutation();
  const [triggerEdit, { isLoading: isLoadingEdit }] = usePatchTicketsByIdEditEvaluationMutation();
  const isLoading = isLoadingCreate || isLoadingEdit;

  const [refetchPendingTickets] = accountApi.endpoints.getTickets.useLazyQuery({});

  const { categoryId } = useSelector(selectUserData);

  const submitHandler = async () => {
    if (!ticket._id) return;

    if (minutes < 30) {
      setErrorMessage('Czas odpowiedzi nie może być krótszy niż 30 min');
      return;
    }

    if (priceInCents < 200) {
      setErrorMessage(`Cena nie może być mniejsza niż 2.00 ${ESupportedCurrency.PLN}`);
      return;
    }

    let result;

    switch (mode) {
      case EActionType.CREATION:
        result = await triggerCreate({
          id: ticket._id,
          body: {
            price: {
              value: priceInCents,
              currency: ESupportedCurrency.PLN
            },
            minutes
          }
        });

        break;

      case EActionType.EDIT:
        if (!userEvaluation?._id) return;

        result = await triggerEdit({
          id: ticket._id,
          body: {
            evaluationId: userEvaluation?._id,
            price: {
              value: priceInCents,
              currency: ESupportedCurrency.PLN
            },
            minutes
          }
        });

        break;
    }

    const isSuccess = !result.error;

    if (isSuccess) {
      closeDialog();

      refetchPendingTickets({
        city: ticket.city,
        categoryId,
        status: getSpecialistPendingTicketStatusesParam()
      });

      toast({
        title: t[mode].toastMessage,
        duration: 3000
      });
    } else {
      const { message } = parseQueryError(result.error!);

      setErrorMessage(message);
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [minutes, priceInCents]);

  const ticketEvaluationForm = (
    <form>
      <div className="flex flex-col justify-center space-y-8">
        <div className="flex w-full flex-col items-center space-y-4">
          <Typography variant="small">Czas odpowiedzi</Typography>

          <div className="flex space-x-3">
            <div className="flex flex-col items-center space-y-1">
              <Label htmlFor="days" className="text-xs">
                Dni
              </Label>
              <TimePickerInput
                picker={ETimePickerType.DAYS}
                id="days"
                ref={daysRef}
                minutes={minutes}
                maxMinutes={maxMinutes}
                setMinutes={setMinutes}
                onRightFocus={() => hoursRef.current?.focus()}
              />
            </div>

            <div className="flex flex-col items-center space-y-1">
              <Label htmlFor="hours" className="text-xs">
                Godziny
              </Label>
              <TimePickerInput
                picker={ETimePickerType.HOURS}
                id="hours"
                ref={hoursRef}
                minutes={minutes}
                maxMinutes={maxMinutes}
                setMinutes={setMinutes}
                onLeftFocus={() => daysRef.current?.focus()}
                onRightFocus={() => minutesRef.current?.focus()}
              />
            </div>

            <div className="flex flex-col items-center space-y-1">
              <Label htmlFor="minutes" className="text-xs">
                Minuty
              </Label>
              <TimePickerInput
                picker={ETimePickerType.MINUTES}
                id="minutes"
                ref={minutesRef}
                minutes={minutes}
                maxMinutes={maxMinutes}
                setMinutes={setMinutes}
                onLeftFocus={() => hoursRef.current?.focus()}
              />
            </div>
          </div>

          <Slider
            value={[minutes]}
            min={0}
            max={maxMinutes}
            step={5}
            onValueChange={minutes => setMinutes(minutes[0])}
          />
        </div>
        <div className="flex w-full flex-col items-center space-y-4">
          <Typography variant="small">Cena</Typography>

          <PriceInput
            className="w-auto text-center"
            defaultInputValue={getFormattedPriceAmount(priceInCents).toString()}
            setPrice={setPriceInCents}
            max={10000}
            currency={ESupportedCurrency.PLN}
          />
        </div>
      </div>
    </form>
  );

  return (
    <DialogComponent
      open={open}
      title={t[mode].dialogTitle}
      cancelButtonText="Anuluj"
      confirmButtonText="Potwierdź"
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      content={ticketEvaluationForm}
      errorMessage={errorMessage}
      // TODO: fix disabled confirm button
      // confirmButtonDisabled={!!errorMessage}
    />
  );
}
