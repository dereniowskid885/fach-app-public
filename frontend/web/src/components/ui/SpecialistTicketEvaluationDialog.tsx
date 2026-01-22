import React, { useEffect, useRef, useState } from 'react';
import DialogComponent from '@/components/common/DialogComponent';
import { Label } from '@/components/shadcn/label';
import { TimePickerInput } from '../common/TimePicker';
import { Typography } from '../common/Typography';
import { Slider } from '../shadcn/slider';
import { ETimePickerType } from '@/constants/enums';
import PriceInput from '../common/PriceInput';
import { ESupportedCurrency } from '@/constants/supportedCurrency';
import { usePatchTicketsByIdEvaluationMutation, accountApi } from '@/api/accountApi';
import { parseQueryError } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export interface ISpecialistTicketEvaluationDialog {
  open: boolean;
  ticketId?: string;
  ticketCity?: string;
  closeDialog: () => void;
}

export default function SpecialistTicketEvaluationDialog({
  open,
  ticketId,
  ticketCity,
  closeDialog
}: ISpecialistTicketEvaluationDialog) {
  const [priceInCents, setPriceInCents] = useState<number>(0);

  const maxMinutes = 1440; // 1 day
  const [minutes, setMinutes] = useState<number>(0);

  const daysRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [trigger, { isLoading }] = usePatchTicketsByIdEvaluationMutation();

  useEffect(() => {
    setErrorMessage('');
  }, [minutes, priceInCents]);

  const { categoryId } = useSelector(selectUserData);
  // Specialist pending tickets refetch
  const [refetch] = accountApi.endpoints.getTickets.useLazyQuery({});

  const submitHandler = async () => {
    if (!ticketId) return;

    if (minutes < 30) {
      setErrorMessage('Czas odpowiedzi nie może być krótszy niż 30 min');
      return;
    }

    if (priceInCents < 200) {
      setErrorMessage(`Cena nie może być mniejsza niż 2.00 ${ESupportedCurrency.PLN}`);
      return;
    }

    const result = await trigger({
      id: ticketId,
      body: {
        price: {
          value: priceInCents,
          currency: ESupportedCurrency.PLN
        },
        minutes
      }
    });
    const isSuccess = !result.error;

    if (isSuccess) {
      closeDialog();
      refetch({ city: ticketCity, categoryId });
      toast({
        title: 'Twoja wycena została wysłana do autora',
        duration: 3000
      });
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
  };

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
      title="Wycena sprawy"
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
