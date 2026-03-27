import React, { useEffect, useRef, useState } from 'react';
import DialogComponent from '@/components/common/DialogComponent';
import { Label } from '@/components/shadcn/label';
import { TimePickerInput } from '../common/TimePicker';
import Typography from '../common/Typography';
import { Slider } from '../shadcn/slider';
import PriceInput from '../common/PriceInput';
import {
  usePatchTicketsByIdEvaluationMutation,
  Ticket,
  usePatchTicketsByIdEditEvaluationMutation,
  Evaluation
} from '@/api/accountApi';
import { getFormattedPriceAmount } from '@/utils/shared';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { EActionType, ETimePickerType } from '@/enums/ui';
import { ESupportedCurrency } from '@shared/enums/currency';

export interface ITicketSpecialistEvaluationDialog {
  open: boolean;
  mode: EActionType;
  ticket: Ticket;
  currentUserEvaluation?: Evaluation;
  closeDialog: () => void;
}

export default function TicketSpecialistEvaluationDialog({
  open,
  mode,
  currentUserEvaluation,
  ticket,
  closeDialog
}: ITicketSpecialistEvaluationDialog) {
  const t = useTranslations();
  const maxMinutes = 1440; // 1 day

  const [priceInCents, setPriceInCents] = useState<number>(
    currentUserEvaluation?.price?.amountInCents ?? 0
  );
  const [minutes, setMinutes] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const daysRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);

  const [triggerCreate, { isLoading: isLoadingCreate, error: createError }] =
    usePatchTicketsByIdEvaluationMutation();
  const [triggerEdit, { isLoading: isLoadingEdit, error: editError }] =
    usePatchTicketsByIdEditEvaluationMutation();
  const isLoading = isLoadingCreate || isLoadingEdit;

  useErrorHandler(createError || editError);

  const submitHandler = async () => {
    if (!ticket._id) return;

    if (minutes < 30) {
      setErrorMessage(t('evaluationDialog.errorMinutes', { amount: 30 }));
      return;
    }

    if (priceInCents < 200) {
      setErrorMessage(
        t('evaluationDialog.errorPrice', { amount: '2.00', currency: ESupportedCurrency.PLN })
      );
      return;
    }

    let result;

    switch (mode) {
      case EActionType.CREATION:
        result = await triggerCreate({
          id: ticket._id,
          body: {
            price: {
              amountInCents: priceInCents,
              currency: ESupportedCurrency.PLN
            },
            minutes
          }
        });

        break;

      case EActionType.EDIT:
        if (!currentUserEvaluation?._id) return;

        result = await triggerEdit({
          id: ticket._id,
          body: {
            evaluationId: currentUserEvaluation?._id,
            price: {
              amountInCents: priceInCents,
              currency: ESupportedCurrency.PLN
            },
            minutes
          }
        });

        break;
    }

    const { error } = result;
    if (error) return;

    closeDialog();
    toast.success(t(`evaluationDialog.toastTitle.${mode.toLowerCase()}`));
  };

  useEffect(() => {
    setErrorMessage('');
  }, [minutes, priceInCents]);

  const ticketEvaluationForm = (
    <form>
      <div className="flex flex-col justify-center space-y-8">
        <div className="flex w-full flex-col items-center space-y-4">
          <Typography variant="small">{t('evaluation.dateOfResponse')}</Typography>

          <div className="flex space-x-3">
            <div className="flex flex-col items-center space-y-1">
              <Label htmlFor="days" className="text-xs">
                {t('evaluationDialog.daysLabel')}
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
                {t('evaluationDialog.hoursLabel')}
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
                {t('evaluationDialog.minutesLabel')}
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
          <Typography variant="small">{t('evaluation.price')}</Typography>

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
      title={t(`evaluationDialog.title.${mode.toLowerCase()}`)}
      cancelButtonText={t('common.cancel')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={submitHandler}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      content={ticketEvaluationForm}
      errorMessage={errorMessage}
      confirmButtonDisabled={!!errorMessage}
    />
  );
}
