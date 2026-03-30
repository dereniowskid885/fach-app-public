import { useForm } from 'react-hook-form';
import DialogComponent from '../common/DialogComponent';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Textarea } from '../shadcn/textarea';
import CategorySelect from './CategorySelect';
import { useEffect, useState } from 'react';
import Typography from '../common/Typography';
import {
  Category,
  Ticket,
  usePatchTicketsByIdMutation,
  usePostTicketsMutation
} from '@/services/api/generated/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { EActionType } from '@/enums/ui';

interface ITicketForm {
  title: string;
  description: string;
}
export interface ITicketFormDialog {
  open: boolean;
  mode: EActionType;
  currentTicketData?: Ticket;
  closeDialog: () => void;
}

export default function TicketFormDialog({
  open,
  mode,
  currentTicketData,
  closeDialog
}: ITicketFormDialog) {
  const t = useTranslations();
  const { city } = useSelector(selectUserData);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch,
    formState,
    clearErrors
  } = useForm<ITicketForm>({
    defaultValues: {
      title: currentTicketData?.title,
      description: currentTicketData?.description
    }
  });

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const formStateErrors = Object.values(formState.errors);
  const formError = formStateErrors.find(error => error.message)?.message;

  const [ticketCategory, setTicketCategory] = useState<Category | undefined>(
    currentTicketData?.category
  );
  const descriptionMaxLength = 3000;
  const [descriptionCharsLeft, setDescriptionCharsLeft] = useState<number>(descriptionMaxLength);
  const descriptionInput = watch('description');

  const [triggerCreate, { isLoading: isLoadingCreate, error: errorTicketCreate }] =
    usePostTicketsMutation();
  const [triggerEdit, { isLoading: isLoadingEdit, error: errorTicketEdit }] =
    usePatchTicketsByIdMutation();
  const isLoading = isLoadingCreate || isLoadingEdit;

  useErrorHandler(errorTicketCreate || errorTicketEdit, {
    setInlineError: message => setErrorMessage(message)
  });

  useEffect(() => {
    const descriptionInputLength = descriptionInput ? descriptionInput.length : 0;
    setDescriptionCharsLeft(descriptionMaxLength - descriptionInputLength);
  }, [descriptionInput]);

  useEffect(() => {
    if (ticketCategory) setErrorMessage('');
  }, [ticketCategory]);

  useEffect(() => {
    if (!open) return;

    setErrorMessage('');
    clearErrors();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submitHandler = async (formData: ITicketForm) => {
    if (!ticketCategory) {
      setErrorMessage(t('ticketFormDialog.errorMissingCategory'));

      return;
    }

    if (!ticketCategory?._id) {
      setErrorMessage(t('ticketFormDialog.errorInvalidCategory'));

      return;
    }

    let result;

    switch (mode) {
      case EActionType.CREATION:
        result = await triggerCreate({
          body: {
            ...formData,
            categoryId: ticketCategory._id,
            city
          }
        });

        break;

      case EActionType.EDIT:
        if (!currentTicketData?._id) return;

        result = await triggerEdit({
          id: currentTicketData._id,
          body: {
            ...formData,
            categoryId: ticketCategory._id
          }
        });

        break;
    }

    const { error } = result;
    if (error) return;

    closeDialog();
    resetForm();
    toast.success(t(`ticketFormDialog.toastTitle.${mode.toLowerCase()}`));
  };

  const ticketCreateForm = (
    <form>
      <div className="flex flex-col gap-4 px-4 text-center">
        <div className="flex w-fit flex-col space-y-1.5 self-center">
          <CategorySelect
            selectedCategory={ticketCategory}
            setSelectedCategory={setTicketCategory}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">{t('ticketFormDialog.titleFormLabel')}</Label>

          <Input
            {...register('title', {
              required: t('ticketFormDialog.errorTitleRequired'),
              minLength: {
                value: 4,
                message: t('ticketFormDialog.errorTitleMinLength', { amount: 4 })
              }
            })}
            id="title"
            type="text"
            minLength={7}
            maxLength={60}
            required
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="description">{t('ticketFormDialog.descriptionFormLabel')}</Label>

          <Textarea
            {...register('description', {
              required: t('ticketFormDialog.errorDescriptionRequired'),
              minLength: {
                value: 7,
                message: t('ticketFormDialog.errorDescriptionMinLength', { amount: 7 })
              }
            })}
            id="description"
            className="min-h-60 resize-none"
            minLength={7}
            maxLength={descriptionMaxLength}
            required
          />

          <Typography variant="note" className="text-right text-muted-foreground">
            {t('ticketFormDialog.descriptionCharsAmount', { amount: descriptionCharsLeft })}
          </Typography>
        </div>
      </div>
    </form>
  );

  return (
    <DialogComponent
      open={open}
      title={t(`ticketFormDialog.title.${mode.toLowerCase()}`)}
      cancelButtonText={t('common.cancel')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={handleSubmit(submitHandler)}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      content={ticketCreateForm}
      errorMessage={errorMessage ? errorMessage : formError}
      confirmButtonDisabled={!!(errorMessage ? errorMessage : formError)}
    />
  );
}
