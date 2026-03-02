import { useForm } from 'react-hook-form';
import DialogComponent from '../common/DialogComponent';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Textarea } from '../shadcn/textarea';
import CategorySelect from './CategorySelect';
import { useEffect, useState } from 'react';
import { Typography } from '../common/Typography';
import {
  Category,
  PostTicketsApiArg,
  useGetTicketsQuery,
  usePostTicketsMutation
} from '@/api/accountApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAppSelector } from '@/redux/hooks';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';

interface ITicketCreateForm {
  category: Category;
  title: string;
  description: string;
}
export interface ITicketCreateDialog {
  open: boolean;
  closeDialog: () => void;
}

export default function TicketCreateDialog({ open, closeDialog }: ITicketCreateDialog) {
  const t = useTranslations();
  const { city } = useSelector(selectUserData);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch,
    formState,
    clearErrors
  } = useForm<ITicketCreateForm>();

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const formStateErrors = Object.values(formState.errors);
  const formError = formStateErrors.find(error => error.message)?.message;

  const [ticketCategory, setTicketCategory] = useState<Category | null>(null);
  const descriptionMaxLength = 3000;
  const [descriptionCharsLeft, setDescriptionCharsLeft] = useState<number>(descriptionMaxLength);
  const descriptionInput = watch('description');

  const [triggerCreateTicketMutation, { isLoading, error: errorTicketCreate }] =
    usePostTicketsMutation();

  const { role, userId } = useAppSelector(selectUserData);
  const filters = buildDashboardTicketsQueryFilters(role, userId);
  const { refetch: refetchTickets, error: errorTicketsRefetch } = useGetTicketsQuery(filters ?? {});

  useErrorHandler(errorTicketCreate || errorTicketsRefetch, {
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

  const submitHandler = async (formData: ITicketCreateForm) => {
    if (!ticketCategory) {
      setErrorMessage(t('ticketCreateDialog.errorMissingCategory'));

      return;
    }

    if (!ticketCategory?._id) {
      setErrorMessage(t('ticketCreateDialog.errorInvalidCategory'));

      return;
    }

    const payload: PostTicketsApiArg = {
      body: {
        ...formData,
        categoryId: ticketCategory._id,
        city
      }
    };

    const { error } = await triggerCreateTicketMutation(payload);
    if (error) return;

    closeDialog();
    resetForm();
    refetchTickets();
    toast.success(t('ticketCreateDialog.toastTitle'));
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
          <Label htmlFor="title">{t('ticketCreateDialog.titleFormLabel')}</Label>

          <Input
            {...register('title', {
              required: t('ticketCreateDialog.errorTitleRequired'),
              minLength: {
                value: 7,
                message: t('ticketCreateDialog.errorTitleMinLength', { amount: 7 })
              }
            })}
            id="title"
            type="text"
            minLength={7}
            maxLength={32}
            required
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="description">{t('ticketCreateDialog.descriptionFormLabel')}</Label>

          <Textarea
            {...register('description', {
              required: t('ticketCreateDialog.errorDescriptionRequired'),
              minLength: {
                value: 7,
                message: t('ticketCreateDialog.errorDescriptionMinLength', { amount: 7 })
              }
            })}
            id="description"
            className="min-h-60 resize-none"
            minLength={7}
            maxLength={descriptionMaxLength}
            required
          />

          <Typography variant="note" className="text-right text-muted-foreground">
            {t('ticketCreateDialog.descriptionCharsAmount', { amount: descriptionCharsLeft })}
          </Typography>
        </div>
      </div>
    </form>
  );

  return (
    <DialogComponent
      open={open}
      title={t('ticketCreateDialog.title')}
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
